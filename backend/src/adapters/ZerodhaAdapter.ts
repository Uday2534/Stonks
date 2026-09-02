import { BrokerAdapter } from './BrokerAdapter';
import { BrokerProfile, Holding, Position } from '../types/broker';
import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';

export class ZerodhaAdapter implements BrokerAdapter {
  constructor(
    private readonly zerodhaClient: ZerodhaClient
  ) {}

  async getProfile(): Promise<BrokerProfile> {
    return this.zerodhaClient.getProfile();
  }

  async getHoldings(): Promise<Holding[]> {
    return this.zerodhaClient.getHoldings();
  }

  async getPositions(): Promise<Position[]> {
    return this.zerodhaClient.getPositions();
  }
}