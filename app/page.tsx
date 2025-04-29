'use client';

import { useEffect, useState } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [datasets, setDatasets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedData, setSelectedData] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const res = await fetch('/api/datasets');
        const data = await res.json();
        setDatasets(data);
      } catch (error) {
        console.error('Erreur lors du chargement des datasets', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDatasets();
  }, []);

  async function handleDatasetClick(datasetName: string) {
    try {
      const res = await fetch(`/datasets/${datasetName}`);
      const text = await res.text();

      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true
      });

      setSelectedDataset(datasetName);
      setSelectedData(parsed.data.slice(0, 5)); // Afficher que les 5 premières lignes
    } catch (error) {
      console.error('Erreur lors du chargement du dataset', error);
    }
  }

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Comparateur de Données 📊</h1>

      {loading ? (
        <p>Chargement des datasets...</p>
      ) : (
        <ul className="space-y-3 w-full max-w-md mb-8">
          {datasets.map((dataset, index) => (
            <li
              key={index}
              className={`rounded-lg shadow p-4 cursor-pointer transition ${selectedDataset === dataset
                  ? 'bg-blue-100 border-2 border-blue-400'
                  : 'bg-white hover:bg-gray-50'
                }`}
              onClick={() => handleDatasetClick(dataset)}
            >
              {dataset}
            </li>
          ))}
        </ul>
      )}

      {selectedDataset && (
        <div className="w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">
            Aperçu de : {selectedDataset}
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded shadow">
              <thead>
                <tr>
                  {selectedData.length > 0 &&
                    Object.keys(selectedData[0]).map((key) => (
                      <th key={key} className="py-2 px-4 border-b text-left">
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {selectedData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(row).map((value, j) => (
                      <td key={j} className="py-2 px-4 border-b">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}