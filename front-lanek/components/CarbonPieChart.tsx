import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { name: string; value: number }[];
  colors: string[];
}

const CarbonPieChart: React.FC<Props> = ({ data, colors }) => (
  <div className="bg-[#23232a] rounded-lg shadow-md p-4 w-full flex flex-col items-center">
    <h3 className="font-bold mb-2 text-blue-300 w-full text-left">
      Porcentaje por tipo de huella
    </h3>
    <ResponsiveContainer width="100%" height={340}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={110}
          label={({ name, percent, x, y, index }) =>
            (percent as number) > 0.04 ? (
              <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
                style={{ pointerEvents: "none" }}
              >
                {name}
              </text>
            ) : null
          }
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const { name, value } = payload[0].payload;
              return (
                <div className="p-3 rounded-lg shadow-lg bg-[#23232a] border border-gray-700 text-gray-100">
                  <div className="font-semibold mb-1">{name}</div>
                  <div>
                    Cantidad: <span className="font-bold">{value}</span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-row flex-wrap justify-center w-full mt-4 gap-4">
      {data.map((entry, idx) => (
        <div key={entry.name} className="flex items-center mx-2 my-1">
          <span
            className="inline-block w-4 h-4 rounded mr-2 border border-gray-400"
            style={{ background: colors[idx % colors.length] }}
          ></span>
          <span className="text-sm text-gray-200 whitespace-nowrap">
            {entry.name}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default CarbonPieChart;
