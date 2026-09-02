// src/services/AnalyticsService.ts
import { ZerodhaAdapter } from '../adapters/ZerodhaAdapter';
import env from '../config/env';
import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';
import prisma from '../prisma/client';
import AppError from '../utils/AppError';

export class AnalyticsService {
  async getNiftyComparison(
    brokerAccountId: string
  ) {
    const portfolioSnapshots =
      await prisma.portfolioSnapshot.findMany({
        where: {
          brokerAccountId,
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    if (portfolioSnapshots.length < 2) {
      throw new AppError(
        'At least 2 portfolio snapshots are required',
        400
      );
    }

    const benchmarkSnapshots =
      await prisma.benchmarkSnapshot.findMany({
        where: {
          benchmark: 'NIFTY50',
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    if (benchmarkSnapshots.length < 2) {
      throw new AppError(
        'At least 2 NIFTY snapshots are required',
        400
      );
    }

    const firstPortfolio =
      portfolioSnapshots[0];

    const latestPortfolio =
      portfolioSnapshots[
        portfolioSnapshots.length - 1
      ];

    const firstNifty =
      benchmarkSnapshots[0];

    const latestNifty =
      benchmarkSnapshots[
        benchmarkSnapshots.length - 1
      ];

    const portfolioReturn =
      ((latestPortfolio.portfolioValue -
        firstPortfolio.portfolioValue) /
        firstPortfolio.portfolioValue) *
      100;

    const niftyReturn =
      ((latestNifty.value -
        firstNifty.value) /
        firstNifty.value) *
      100;

    const alpha =
      portfolioReturn - niftyReturn;

    return {
      portfolioReturn:
        Number(portfolioReturn.toFixed(2)),
      niftyReturn:
        Number(niftyReturn.toFixed(2)),
      alpha:
        Number(alpha.toFixed(2)),
    };
  }
  async getChartData(
    brokerAccountId: string
  ) {
    const portfolioSnapshots =
      await prisma.portfolioSnapshot.findMany({
        where: {
          brokerAccountId,
        },
        orderBy: {
          snapshotDate: 'asc',
        },
        select: {
          snapshotDate: true,
          portfolioValue: true,
        },
      });

    const benchmarkSnapshots =
      await prisma.benchmarkSnapshot.findMany({
        where: {
          benchmark: 'NIFTY50',
        },
        orderBy: {
          snapshotDate: 'asc',
        },
        select: {
          snapshotDate: true,
          value: true,
        },
      });

    return {
      portfolio:
        portfolioSnapshots.map(
          (snapshot) => ({
            date:
              snapshot.snapshotDate,
            value:
              snapshot.portfolioValue,
          })
        ),

      nifty:
        benchmarkSnapshots.map(
          (snapshot) => ({
            date:
              snapshot.snapshotDate,
            value: snapshot.value,
          })
        ),
    };
  }
  async getAssetAllocation(
    accessToken: string
  ) {
    const client = new ZerodhaClient(
      env.zerodhaApiKey,
      accessToken
    );

    const adapter =
      new ZerodhaAdapter(client);

    const holdings =
      await adapter.getHoldings();

    const totalValue = holdings.reduce(
      (sum, holding) =>
        sum +
        holding.quantity *
          holding.currentPrice,
      0
    );

    const allocation = holdings.map(
      (holding) => {
        const value =
          holding.quantity *
          holding.currentPrice;

        return {
          symbol: holding.symbol,
          value,
          percentage:
            totalValue === 0
              ? 0
              : Number(
                  (
                    (value /
                      totalValue) *
                    100
                  ).toFixed(2)
                ),
        };
      }
    );

    allocation.sort(
      (a, b) => b.value - a.value
    );

    return {
      totalValue,
      allocation,
    };
  }
  async compareWithNifty(
    brokerAccountId: string,
    days = 365
  ) {
    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() - days
    );

    const portfolioSnapshots =
      await prisma.portfolioSnapshot.findMany({
        where: {
          brokerAccountId,
          snapshotDate: {
            gte: startDate,
          },
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    const benchmarkSnapshots =
      await prisma.benchmarkSnapshot.findMany({
        where: {
          benchmark: 'NIFTY50',
          snapshotDate: {
            gte: startDate,
          },
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    if (
      portfolioSnapshots.length < 2 ||
      benchmarkSnapshots.length < 2
    ) {
      throw new Error(
        'Not enough data available'
      );
    }

    const firstPortfolio =
      portfolioSnapshots[0];

    const latestPortfolio =
      portfolioSnapshots[
        portfolioSnapshots.length - 1
      ];

    const firstBenchmark =
      benchmarkSnapshots[0];

    const latestBenchmark =
      benchmarkSnapshots[
        benchmarkSnapshots.length - 1
      ];

    const portfolioReturn =
      (
        ((latestPortfolio.portfolioValue -
          firstPortfolio.portfolioValue) /
          firstPortfolio.portfolioValue) *
        100
      );

    const niftyReturn =
      (
        ((latestBenchmark.value -
          firstBenchmark.value) /
          firstBenchmark.value) *
        100
      );

    return {
      days,
      portfolioReturn:
        Number(
          portfolioReturn.toFixed(2)
        ),
      niftyReturn:
        Number(
          niftyReturn.toFixed(2)
        ),
      alpha:
        Number(
          (
            portfolioReturn -
            niftyReturn
          ).toFixed(2)
        ),
    };
  }
  async getPerformanceSeries(
    brokerAccountId: string,
    days = 365
  ) {
    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() - days
    );

    const portfolioSnapshots =
      await prisma.portfolioSnapshot.findMany({
        where: {
          brokerAccountId,
          snapshotDate: {
            gte: startDate,
          },
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    const benchmarkSnapshots =
      await prisma.benchmarkSnapshot.findMany({
        where: {
          benchmark: 'NIFTY50',
          snapshotDate: {
            gte: startDate,
          },
        },
        orderBy: {
          snapshotDate: 'asc',
        },
      });

    if (
      portfolioSnapshots.length === 0 ||
      benchmarkSnapshots.length === 0
    ) {
      return {
        series: [],
      };
    }

    const basePortfolioValue =
      portfolioSnapshots[0].portfolioValue;

    const baseNiftyValue =
      benchmarkSnapshots[0].value;

    const benchmarkMap = new Map(
      benchmarkSnapshots.map(
        (snapshot) => [
          snapshot.snapshotDate
            .toISOString()
            .split('T')[0],
          snapshot.value,
        ]
      )
    );

    const series =
      portfolioSnapshots
        .map((portfolioSnapshot) => {
          const date =
            portfolioSnapshot.snapshotDate
              .toISOString()
              .split('T')[0];

          const niftyValue =
            benchmarkMap.get(date);

          if (!niftyValue) {
            return null;
          }

          const portfolioReturn =
            (
              (portfolioSnapshot.portfolioValue -
                basePortfolioValue) /
              basePortfolioValue
            ) * 100;

          const niftyReturn =
            (
              (niftyValue -
                baseNiftyValue) /
              baseNiftyValue
            ) * 100;

          return {
            date,

            portfolioReturn:
              Number(
                portfolioReturn.toFixed(2)
              ),

            niftyReturn:
              Number(
                niftyReturn.toFixed(2)
              ),
          };
        })
        .filter(Boolean);

    return {
      series,
    };
  }
}