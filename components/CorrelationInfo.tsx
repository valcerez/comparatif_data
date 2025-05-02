type Props = {
  explanation: string;
  pValue: number;
  nPoints: number;
};

export default function CorrelationInfo({ explanation, pValue, nPoints }: Props) {
  return (
    <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-lg text-center">
      <h2 className="text-xl font-semibold mb-2">Analyse de la Corrélation</h2>
      <p className="mb-2">{explanation}</p>
      <p className="mb-1 text-sm text-gray-600">
        Nombre d&apos;années comparées : <strong>{nPoints}</strong>
      </p>
      <p className="text-sm text-gray-600">
        Valeur p : <strong>{pValue.toExponential(2)}</strong>{' '}
        {pValue < 0.05 ? '✅ Corrélation significative' : '⚠️ Corrélation non significative'}
      </p>
    </div>
  );
}