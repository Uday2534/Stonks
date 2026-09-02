import type { Holding } from '../types/holding';
import { formatCurrency } from '../utils/formatter';

type Props = {
  holdings: Holding[];
};

const HoldingsTable = ({
  holdings,
}: Props) => {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 p-6">
        <h2 className="text-xl font-semibold text-white">
          Holdings
        </h2>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800 text-left text-slate-400">
            <th className="p-4">
              Symbol
            </th>

            <th className="p-4">
              Qty
            </th>

            <th className="p-4">
              Avg Price
            </th>

            <th className="p-4">
              Current Price
            </th>

            <th className="p-4">
              P&L
            </th>
          </tr>
        </thead>

        <tbody>
          {holdings.map(
            (holding) => {
              const pnl =
                (holding.currentPrice -
                  holding.averagePrice) *
                holding.quantity;

              return (
                <tr
                  key={
                    holding.symbol
                  }
                  className="border-b border-slate-800"
                >
                  <td className="p-4 font-medium text-white">
                    {
                      holding.symbol
                    }
                  </td>

                  <td className="p-4 text-slate-300">
                    {
                      holding.quantity
                    }
                  </td>

                  <td className="p-4 text-slate-300">
                    {formatCurrency(
                      holding.averagePrice
                    )}
                  </td>

                  <td className="p-4 text-slate-300">
                    {formatCurrency(
                      holding.currentPrice
                    )}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      pnl >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {formatCurrency(
                      pnl
                    )}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;