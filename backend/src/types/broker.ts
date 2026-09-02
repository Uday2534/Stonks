export type BrokerName = 'zerodha' | 'groww';

export interface BrokerProfile {
  brokerUserId: string;
  name: string;
  email: string;
}

export interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  previousClose: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  pnl: number;
}
