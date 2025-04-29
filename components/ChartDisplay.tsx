'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Props = {
  x: number[];
  y1: number[];
  y2: number[];
  label1: string;
  label2: string;
};

export default function ChartDisplay({ x, y1, y2, label1, label2 }: Props) {
  const data = x.map((year, i) => ({
    year,
    [label1]: y1[i],
    [label2]: y2[i],
  }));

  return (
    <div className="w-full max-w-4xl h-96 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={label1}
            stroke="#8884d8"
            dot={false}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={label2}
            stroke="#82ca9d"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}