import YahooFinance from 'yahoo-finance2';

import { BenchmarkProvider } from './BenchmarkProvider';

export class YahooFinanceProvider
  implements BenchmarkProvider
{
  private readonly yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

  async getNiftyValue(): Promise<number> {
    try {
      const quote = await this.yahooFinance.quote(
        '^NSEI'
      );

      const value = Number(
        (quote as { regularMarketPrice?: number })
          .regularMarketPrice
      );

      if (!Number.isFinite(value)) {
        throw new Error(
          'NIFTY value is unavailable'
        );
      }

      return value;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown Yahoo Finance error';

      throw new Error(
        `Failed to fetch NIFTY value: ${message}`
      );
    }
  }
}