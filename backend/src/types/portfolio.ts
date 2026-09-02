export interface PortfolioHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  previousClose: number;
  investedValue: number;
  currentValue: number;
  pnl: number;
}

export interface PortfolioSummary {
  investedValue: number;
  currentValue: number;
  totalPnl: number;
  returnPercentage: number;
  dailyPnl: number;
  holdings: PortfolioHolding[];
}

export interface PortfolioSnapshotDTO {
  portfolioValue: number;
  investedValue: number;
  totalPnl: number;
  dailyPnl: number;
  generatedAt: Date;
}