import { BrokerProfile, Holding, Position } from '../types/broker';

export interface BrokerAdapter {
  getProfile(): Promise<BrokerProfile>;
  getHoldings(): Promise<Holding[]>;
  getPositions(): Promise<Position[]>;
}
