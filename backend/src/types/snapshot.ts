export interface SnapshotRecord {
  id: string;
  portfolioValue: number;
  investedValue: number;
  totalPnl: number;
  dailyPnl: number;
  snapshotDate: Date;
  brokerAccountId: string;
}

export interface PortfolioHistoryPoint {
  snapshotDate: Date;
  portfolioValue: number;
  investedValue: number;
  totalPnl: number;
}

export interface SaveSnapshotInput {
  portfolioValue: number;
  investedValue: number;
  totalPnl: number;
  dailyPnl: number;
  snapshotDate: Date;
  brokerAccountId: string;
}
