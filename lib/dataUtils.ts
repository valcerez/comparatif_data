import Papa from 'papaparse';

export type RawRow = Record<string, string>;

export type CleanedData = {
  year: number;
  value: number;
};

/**
 * Charge un fichier CSV brut, sans nettoyage ni pivot.
 */
export async function loadRawDataset(filename: string): Promise<RawRow[]> {
  const res = await fetch(`/datasets/${filename}`);
  const text = await res.text();

  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data as RawRow[];
}

/**
 * Transforme une ligne pivotée en tableau [ { year, value } ]
 * en ne gardant que les années (ex : "2000", "2001", ...)
 */
export function pivotToLongFormat(
  data: RawRow[],
  country: string,
  countryKey: string = 'Country Name'
): CleanedData[] {
  const countryRow = data.find(row => row[countryKey] === country);
  if (!countryRow) return [];

  return Object.entries(countryRow)
    .filter(([key]) => /^\d{4}$/.test(key)) // garder seulement les colonnes de type année
    .map(([year, value]) => ({
      year: parseInt(year),
      value: parseFloat(value.replace(/,/g, '').replace(/\s/g, '')) || 0
    }))
    .filter(row => !isNaN(row.year) && !isNaN(row.value));
}

/**
 * Renvoie la liste des pays présents dans les deux fichiers.
 */
export function getCommonCountries(
  dataA: RawRow[],
  dataB: RawRow[],
  countryKey: string = 'Country Name'
): string[] {
  const countriesA = dataA
    .map((row) => row[countryKey])
    .filter((val) => typeof val === 'string' && val.trim() !== '');

  const countriesB = dataB
    .map((row) => row[countryKey])
    .filter((val) => typeof val === 'string' && val.trim() !== '');

  const common = countriesA.filter((country) => countriesB.includes(country));

  // Supprimer les doublons
  return [...new Set(common)];
}
/**
 * Aligne deux tableaux de données `{ year, value }` sur les années communes.
 */
export function alignDatasets(
  data1: CleanedData[],
  data2: CleanedData[]
): { x: number[]; y1: number[]; y2: number[] } {
  const commonYears = data1
    .map(d => d.year)
    .filter(year => data2.some(e => e.year === year));

  const y1 = commonYears.map(year => data1.find(d => d.year === year)?.value ?? 0);
  const y2 = commonYears.map(year => data2.find(d => d.year === year)?.value ?? 0);

  return {
    x: commonYears,
    y1,
    y2
  };
}