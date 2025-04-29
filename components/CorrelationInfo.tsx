'use client';

type Props = {
  r: number;
  explanation: string;
};

export default function CorrelationInfo({ r, explanation }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow mt-6 max-w-xl text-center">
      <h3 className="text-xl font-semibold mb-2">Corrélation : {r}</h3>
      <p className="text-gray-700">{explanation}</p>
    </div>
  );
}