import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { fecha: string; co2e: number }[];
}

const CarbonLineChart: React.FC<Props> = ({ data }) => (
  <div className="bg-[#23232a] rounded-lg shadow-md p-4">
    <h3 className="font-bold mb-2 text-blue-300">
      Huella de carbono en el tiempo
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <XAxis dataKey="fecha" stroke="#e5e7eb" />
        <YAxis stroke="#e5e7eb" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="p-3 rounded-lg shadow-lg bg-[#23232a] border border-gray-700 text-gray-100">
                  <div className="font-semibold mb-1">Fecha: {label}</div>
                  <div>
                    CO₂e: <span className="font-bold">{payload[0].value}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line type="monotone" dataKey="co2e" stroke="#34d399" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default CarbonLineChart;
