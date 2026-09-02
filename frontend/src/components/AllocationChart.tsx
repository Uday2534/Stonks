import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import type { Holding } from '../types/holding';

type Props = {
  holdings: Holding[];
};

const COLORS = [
  '#22c55e',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

const AllocationChart = ({
  holdings,
}: Props) => {
  const data = holdings.map(
    (holding) => ({
      name: holding.symbol,
      value:
        holding.quantity *
        holding.currentPrice,
    })
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Portfolio Allocation
      </h2>

      <div className="h-96">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              labelLine={false}
              label={({ percent, name }) =>
                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
            >
              {data.map(
                (_entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                          COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip
                formatter={(value) =>
                    `₹${Number(value).toFixed(2)}`
                }
                />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AllocationChart;