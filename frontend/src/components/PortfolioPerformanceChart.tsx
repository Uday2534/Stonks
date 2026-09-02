import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type ChartPoint = {
  date: string;
  portfolioReturn: number;
  niftyReturn: number;
};

type Props = {
  data: ChartPoint[];
};

const PortfolioPerformanceChart = ({
  data,
}: Props) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Portfolio vs Nifty
      </h2>

      <div className="h-96">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis dataKey="date" />

            <YAxis
              tickFormatter={(value) =>
                `${value.toFixed(0)}%`
              }
            />

            <Tooltip
              formatter={(value) =>
                `${Number(value).toFixed(2)}%`
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="portfolioReturn"
              name="Portfolio"
            />

            <Line
              type="monotone"
              dataKey="niftyReturn"
              name="Nifty 50"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioPerformanceChart;