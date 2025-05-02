// Calculer la corrélation de Pearson
export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const avgX = x.reduce((a, b) => a + b, 0) / n;
  const avgY = y.reduce((a, b) => a + b, 0) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
  const denominatorX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - avgX) ** 2, 0));
  const denominatorY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - avgY) ** 2, 0));

  return numerator / (denominatorX * denominatorY);
}

// Calculer la p-value associée à la corrélation (approximation bilatérale)
export function calculatePValue(r: number, n: number): number {
  if (n < 3) return 1; // Pas assez de points pour tester

  const t = (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);

  // Approximation avec la fonction d'erreur pour grands n (gaussienne)
  const p = 2 * (1 - normalCDF(Math.abs(t)));

  return p;
}

// Approximation de la fonction de répartition normale standard
function normalCDF(x: number): number {
  return (1 + erf(x / Math.sqrt(2))) / 2;
}

// Approximation numérique de la fonction erf
function erf(x: number): number {
  // Abramowitz and Stegun formula 7.1.26
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}