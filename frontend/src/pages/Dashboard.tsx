import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import SummaryCard from '../components/SummaryCard';
import HoldingsTable from '../components/HoldingsTable';
import AllocationChart from '../components/AllocationChart';
import PortfolioPerformanceChart from '../components/PortfolioPerformanceChart';

import {
  getLatestSnapshot,
  getSnapshotHistory,
} from '../apis/snapshot';

import {
  getHoldings,
} from '../apis/holdings';

import {
  getBenchmarkHistory,
} from '../apis/benchmark';

import { getBrokerStatus } from '../apis/broker';

import { formatCurrency } from '../utils/formatter';
import { percentageSeries } from '../utils/chart';

import type { Holding } from '../types/holding';

import api from '../apis/axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const [snapshot, setSnapshot] =
    useState<any>(null);

  const [holdings, setHoldings] =
    useState<Holding[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [sessionExpired, setSessionExpired] =
    useState(false);

  const [chartData, setChartData] =
    useState<
      {
        date: string;
        portfolioReturn: number;
        niftyReturn: number;
      }[]
    >([]);
  const [brokerStatus, setBrokerStatus] =
  useState<any>(null);
  const reconnectZerodha =
    async () => {
      try {
        const response =
          await api.get(
            '/broker/zerodha/login'
          );

        window.location.href =
          response.data.loginUrl;
      } catch (error) {
        console.error(
          'Reconnect failed:',
          error
        );
      }
    };

  useEffect(() => {
    const load = async () => {
      try {
        const status = await getBrokerStatus();

        setBrokerStatus(status);

        if (!status.hasBroker) {
          navigate('/connect-broker');
          return;
        }

        if (!status.isConnected) {
          setSessionExpired(true);
          return;
        }

        const snapshotData =
          await getLatestSnapshot();

        const holdingsData =
          await getHoldings();

        setSnapshot(
          snapshotData
        );

        setHoldings(
          holdingsData
        );

        try {
          const snapshotHistory =
            await getSnapshotHistory(
              30
            );

          const benchmarkHistory =
            await getBenchmarkHistory(
              'NIFTY50',
              30
            );

          if (
            snapshotHistory.length >
              1 &&
            benchmarkHistory.length >
              1
          ) {
            const portfolioValues =
              snapshotHistory.map(
                (s: any) =>
                  s.portfolioValue
              );

            const niftyValues =
              benchmarkHistory.map(
                (b: any) =>
                  b.value
              );

            const portfolioReturns =
              percentageSeries(
                portfolioValues
              );

            const niftyReturns =
              percentageSeries(
                niftyValues
              );

            const merged =
              snapshotHistory.map(
                (
                  item: any,
                  index: number
                ) => ({
                  date:
                    new Date(
                      item.snapshotDate
                    ).toLocaleDateString(),

                  portfolioReturn:
                    portfolioReturns[
                      index
                    ],

                  niftyReturn:
                    niftyReturns[
                      index
                    ],
                })
              );

            setChartData(
              merged
            );
          }
        } catch (
          chartError
        ) {
          console.error(
            'Chart data error:',
            chartError
          );
        }
      } catch (
        error: any
      ) {
        console.error(
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (sessionExpired) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Zerodha Session
            Expired
          </h2>

          <p className="mb-6 text-slate-300">
            Your Zerodha
            access token has
            expired. Please
            reconnect your
            account.
          </p>

          <button
            onClick={
              reconnectZerodha
            }
            className="rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Reconnect
            Zerodha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="mb-8 text-4xl font-bold text-white">
        Portfolio Dashboard
      </h1>
      {
        brokerStatus && (
          <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Broker Status
            </h2>

            <div className="space-y-2 text-sm">
              <p
                className={
                  brokerStatus.isConnected
                    ? 'text-green-400'
                    : 'text-red-400'
                }
              >
                {brokerStatus.isConnected
                  ? '🟢 Connected'
                  : '🔴 Session Expired'}
              </p>

              {brokerStatus.lastSyncedAt && (
                <p className="text-slate-400">
                  Last Sync:{' '}
                  {new Date(
                    brokerStatus.lastSyncedAt
                  ).toLocaleString()}
                </p>
              )}

              {brokerStatus.lastSyncError && (
                <p className="text-red-400">
                  {brokerStatus.lastSyncError}
                </p>
              )}
            </div>
          </div>
        )
      }
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Portfolio Value"
          value={formatCurrency(
            snapshot?.portfolioValue ??
              0
          )}
        />

        <SummaryCard
          title="Invested Value"
          value={formatCurrency(
            snapshot?.investedValue ??
              0
          )}
        />

        <SummaryCard
          title="Total P&L"
          value={formatCurrency(
            snapshot?.totalPnl ??
              0
          )}
          positive={
            (snapshot?.totalPnl ??
              0) >= 0
          }
        />

        <SummaryCard
          title="Daily P&L"
          value={formatCurrency(
            snapshot?.dailyPnl ??
              0
          )}
          positive={
            (snapshot?.dailyPnl ??
              0) >= 0
          }
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <AllocationChart
          holdings={
            holdings
          }
        />

        <PortfolioPerformanceChart
          data={chartData}
        />
      </div>

      <HoldingsTable
        holdings={
          holdings
        }
      />
    </div>
  );
};

export default Dashboard;