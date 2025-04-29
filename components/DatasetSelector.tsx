'use client';

import { useEffect, useState } from 'react';
import { getLabelForDataset } from '@/lib/datasetLabels';

type DatasetSelectorProps = {
  onCompare: (datasetA: string, datasetB: string) => void;
};

export default function DatasetSelector({ onCompare }: DatasetSelectorProps) {
  const [datasets, setDatasets] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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

  function toggleSelection(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) {
        return prev.filter((item) => item !== name);
      } else if (prev.length < 2) {
        return [...prev, name];
      } else {
        return prev;
      }
    });
  }

  useEffect(() => {
    if (selected.length === 2) {
      onCompare(selected[0], selected[1]);
    }
  }, [selected, onCompare]);

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sélectionnez 2 jeux de données à comparer :</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className="space-y-3">
          {datasets.map((dataset) => (
            <li
              key={dataset}
              onClick={() => toggleSelection(dataset)}
              className={`cursor-pointer p-4 rounded-lg shadow transition ${selected.includes(dataset)
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-white hover:bg-gray-100'
                }`}
            >
              {getLabelForDataset(dataset)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}