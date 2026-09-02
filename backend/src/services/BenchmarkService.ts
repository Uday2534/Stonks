// src/services/BenchmarkService.ts

import prisma from '../prisma/client';
import { YahooFinanceProvider } from '../provider/YahooFinanceProvider';

export class BenchmarkService {
  private readonly provider =
    new YahooFinanceProvider();

  async saveSnapshot(
    benchmark: string,
    value: number,
    snapshotDate = new Date()
  ) {
    return prisma.benchmarkSnapshot.create({
      data: {
        benchmark,
        value,
        snapshotDate,
      },
    });
  }

  async getHistory(
    benchmark: string,
    startDate: Date,
    endDate: Date
  ) {
    return prisma.benchmarkSnapshot.findMany({
      where: {
        benchmark,
        snapshotDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        snapshotDate: 'asc',
      },
    });
  }

  async saveDailyNiftySnapshot() {
    const niftyValue =
      await this.provider.getNiftyValue();

    return prisma.benchmarkSnapshot.create({
      data: {
        benchmark: 'NIFTY50',
        value: niftyValue,
        snapshotDate: new Date(),
      },
    });
  }
}