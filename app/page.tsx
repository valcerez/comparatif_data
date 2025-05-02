'use client';

import { useState } from 'react';
import DatasetSelector from '@/components/DatasetSelector';
import {
  loadRawDataset,
  pivotToLongFormat,
  alignDatasets,
  getCommonCountries,
} from '@/lib/dataUtils';
import ChartDisplay from '@/components/ChartDisplay';
import { calculatePearsonCorrelation, calculatePValue } from '@/lib/statsUtils';
import { explainCorrelation } from '@/lib/explanationUtils';
import CorrelationInfo from '@/components/CorrelationInfo';
import { motion, AnimatePresence } from 'framer-motion';
import { getLabelForDataset } from '@/lib/datasetLabels';

export default function Home() {
  const [selectedPair, setSelectedPair] = useState<[string, string] | null>(null);
  const [countries, setCountries] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    x: number[];
    y1: number[];
    y2: number[];
    label1: string;
    label2: string;
  } | null>(null);
  const [yearRange, setYearRange] = useState<{ min: number; max: number } | null>(null);

  const resetAll = () => {
    setSelectedPair(null);
    setSelectedCountry(null);
    setCountries([]);
    setChartData(null);
    setYearRange(null);
  };

  const resetCountry = () => {
    setSelectedCountry(null);
    setChartData(null);
    setYearRange(null);
  };

  const handleCountrySelect = async (country: string) => {
    if (!selectedPair) return;

    const [fileA, fileB] = selectedPair;
    const rawA = await loadRawDataset(fileA);
    const rawB = await loadRawDataset(fileB);

    const cleanedA = pivotToLongFormat(rawA, country);
    const cleanedB = pivotToLongFormat(rawB, country);
    const { x, y1, y2 } = alignDatasets(cleanedA, cleanedB);

    const minYear = Math.min(...x);
    const maxYear = Math.max(...x);

    setSelectedCountry(country);
    setChartData({
      x,
      y1,
      y2,
      label1: fileA,
      label2: fileB,
    });
    setYearRange({ min: minYear, max: maxYear });
  };

  return (
    <main className="min-h-screen p-6 flex flex-col items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Comparateur de Données 📊</h1>

      <AnimatePresence mode="wait">
        {!selectedPair ? (
          <motion.div
            key="select-datasets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            <DatasetSelector
              onCompare={async (datasetA, datasetB) => {
                const rawA = await loadRawDataset(datasetA);
                const rawB = await loadRawDataset(datasetB);
                const commonCountries = getCommonCountries(rawA, rawB);
                const sortedCountries = [...commonCountries].sort((a, b) =>
                  a.localeCompare(b, 'fr', { ignorePunctuation: true })
                );
                setSelectedPair([datasetA, datasetB]);
                setCountries(sortedCountries);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="select-country-or-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center"
          >
            <p className="text-lg mb-4">
              Vous avez sélectionné :{' '}
              <strong>{getLabelForDataset(selectedPair[0])}</strong> et{' '}
              <strong>{getLabelForDataset(selectedPair[1])}</strong>
            </p>

            {!selectedCountry ? (
              <>
                <div className="mb-6">
                  <label className="block mb-2 font-semibold">Choisissez un pays :</label>
                  <select
                    onChange={(e) => handleCountrySelect(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">-- Sélectionnez un pays --</option>
                    {countries.map((country, index) =>
                      typeof country === 'string' && country.trim() !== '' ? (
                        <option key={`${country}-${index}`} value={country}>
                          {country}
                        </option>
                      ) : null
                    )}
                  </select>
                </div>
                <button
                  onClick={resetAll}
                  className="mt-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  🔙 Recommencer depuis le début
                </button>
              </>
            ) : chartData && yearRange ? (
              <>
                <div className="flex gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Année de début</label>
                    <input
                      type="number"
                      value={yearRange.min}
                      min={Math.min(...chartData.x)}
                      max={yearRange.max}
                      onChange={(e) =>
                        setYearRange((prev) =>
                          prev ? { ...prev, min: parseInt(e.target.value) } : null
                        )
                      }
                      className="border rounded px-2 py-1 w-28 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Année de fin</label>
                    <input
                      type="number"
                      value={yearRange.max}
                      min={yearRange.min}
                      max={Math.max(...chartData.x)}
                      onChange={(e) =>
                        setYearRange((prev) =>
                          prev ? { ...prev, max: parseInt(e.target.value) } : null
                        )
                      }
                      className="border rounded px-2 py-1 w-28 text-center"
                    />
                  </div>
                </div>

                {(() => {
                  const filteredData = chartData.x
                    .map((year, i) => ({
                      year,
                      y1: chartData.y1[i],
                      y2: chartData.y2[i],
                    }))
                    .filter(
                      (d) =>
                        d.year >= (yearRange.min ?? 0) &&
                        d.year <= (yearRange.max ?? Infinity)
                    );

                  const rFiltered = calculatePearsonCorrelation(
                    filteredData.map((d) => d.y1),
                    filteredData.map((d) => d.y2)
                  );
                  const explanationFiltered = explainCorrelation(
                    rFiltered,
                    getLabelForDataset(chartData.label1),
                    getLabelForDataset(chartData.label2)
                  );
                  const pValue = calculatePValue(rFiltered, filteredData.length);
                  const nPoints = filteredData.length;

                  return (
                    <>
                      <ChartDisplay
                        x={filteredData.map((d) => d.year)}
                        y1={filteredData.map((d) => d.y1)}
                        y2={filteredData.map((d) => d.y2)}
                        label1={chartData.label1}
                        label2={chartData.label2}
                      />

                      <CorrelationInfo
                        explanation={explanationFiltered}
                        pValue={pValue}
                        nPoints={nPoints}
                      />
                    </>
                  );
                })()}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={resetCountry}
                    className="px-4 py-2 bg-blue-200 rounded hover:bg-blue-300 transition"
                  >
                    🔙 Revenir au choix du pays
                  </button>

                  <button
                    onClick={resetAll}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                  >
                    🆕 Recommencer depuis le début
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}