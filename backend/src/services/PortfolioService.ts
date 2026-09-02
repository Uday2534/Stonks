import { BrokerAdapter } from '../adapters/BrokerAdapter';
import { Holding } from '../types/broker';

import {
  PortfolioHolding,
  PortfolioSnapshotDTO,
  PortfolioSummary,
} from '../types/portfolio';

export class PortfolioService {
  constructor(
    private readonly brokerAdapter: BrokerAdapter
  ) {}

  /**
   * Calculates the total capital invested.
   */
  calculateInvestedValue(
    holdings: Holding[] = []
  ): number {
    return holdings.reduce(
      (total, holding) =>
        total +
        holding.quantity *
          holding.averagePrice,
      0
    );
  }

  /**
   * Calculates the current market value.
   */
  calculateCurrentValue(
    holdings: Holding[] = []
  ): number {
    return holdings.reduce(
      (total, holding) =>
        total +
        holding.quantity *
          holding.currentPrice,
      0
    );
  }

  /**
   * Calculates total profit/loss.
   */
  calculateTotalPnl(
    holdings: Holding[] = []
  ): number {
    return (
      this.calculateCurrentValue(
        holdings
      ) -
      this.calculateInvestedValue(
        holdings
      )
    );
  }

  /**
   * Placeholder until real broker APIs
   * provide daily change data.
   */
  calculateTodayPnl(
    holdings: Holding[] = []
  ): number {
    return holdings.reduce(
      (total, holding) =>
        total +
        holding.quantity *
        (
          holding.currentPrice -
          holding.previousClose
        ),
      0
    );
  }

  /**
   * Calculates portfolio return percentage.
   */
  calculateReturnPercentage(
    investedValue: number,
    totalPnl: number
  ): number {
    if (investedValue === 0) {
      return 0;
    }

    return (
      (totalPnl / investedValue) *
      100
    );
  }

  /**
   * Builds the current portfolio summary.
   */
  async getCurrentPortfolio(): Promise<PortfolioSummary> {
    const holdings =
      await this.brokerAdapter.getHoldings();

    let investedValue = 0;
    let currentValue = 0;
    let dailyPnl = 0;
    const normalizedHoldings: PortfolioHolding[] =
      holdings.map((holding) => {
        const holdingInvestedValue =
          holding.quantity *
          holding.averagePrice;

        const holdingCurrentValue =
          holding.quantity *
          holding.currentPrice;

        const pnl =
          holdingCurrentValue -
          holdingInvestedValue;

        dailyPnl +=
          holding.quantity *
          (
            holding.currentPrice -
            holding.previousClose
          );

        return {
          symbol: holding.symbol,
          quantity: holding.quantity,
          averagePrice:
            holding.averagePrice,
          currentPrice:
            holding.currentPrice,
          previousClose:
            holding.previousClose,
          investedValue:
            holdingInvestedValue,
          currentValue:
            holdingCurrentValue,
          pnl,
        };
      });

    const totalPnl =
      currentValue -
      investedValue;

    const returnPercentage =
      this.calculateReturnPercentage(
        investedValue,
        totalPnl
      );

    return {
      investedValue,
      currentValue,
      totalPnl,
      returnPercentage,
      dailyPnl,
      holdings:
        normalizedHoldings,
    };
  }

  /**
   * Creates a portfolio snapshot
   * without persisting it.
   */
  async generateSnapshot(): Promise<PortfolioSnapshotDTO> {
    const portfolio =
      await this.getCurrentPortfolio();

    return {
      portfolioValue:
        portfolio.currentValue,

      investedValue:
        portfolio.investedValue,

      totalPnl:
        portfolio.totalPnl,

      dailyPnl:
        this.calculateTodayPnl(
          portfolio.holdings
        ),

      generatedAt:
        new Date(),
    };
  }
}