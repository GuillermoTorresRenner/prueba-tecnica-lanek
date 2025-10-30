import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Props {
  data: { fecha: string; acumulado: number }[];
}

const CarbonBarChart: React.FC<Props> = ({ data }) => (
  <div className="bg-[#23232a] rounded-lg shadow-md p-4">
    <h3 className="font-bold mb-2 text-green-300">
      Acumulativo de huella de carbono
    </h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="fecha" stroke="#e5e7eb" />
        <YAxis stroke="#e5e7eb" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="p-3 rounded-lg shadow-lg bg-[#23232a] border border-gray-700 text-gray-100">
                  <div className="font-semibold mb-1">Fecha: {label}</div>
                  <div>
                    CO₂e acumulado:{" "}
                    <span className="font-bold">{payload[0].value}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend wrapperStyle={{ color: "#fff" }} />
        <Bar dataKey="acumulado" fill="#60a5fa" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CarbonBarChart;
