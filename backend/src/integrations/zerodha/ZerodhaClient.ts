import { KiteConnect } from 'kiteconnect';

import { BrokerProfile, Holding, Position } from '../../types/broker';

export class ZerodhaClient {
  private readonly kite: InstanceType<typeof KiteConnect>;

  constructor(
    private readonly apiKey: string,
    accessToken?: string,
  ) {
    this.kite = new KiteConnect({
      api_key: apiKey,
    });

    if (accessToken) {
      this.kite.setAccessToken(accessToken);
    }
  }

  getLoginUrl(): string {
    return this.kite.getLoginURL();
  }

  async generateSession(
    requestToken: string,
    apiSecret: string,
  ) {
    return this.kite.generateSession(
      requestToken,
      apiSecret,
    );
  }

  async getProfile(): Promise<BrokerProfile> {
    const profile = await this.kite.getProfile();

    return {
      brokerUserId: profile.user_id,
      name: profile.user_name,
      email: profile.email,
    };
  }

  async getHoldings(): Promise<Holding[]> {
    try {
      const holdings =
        await this.kite.getHoldings();

      return holdings.map((holding) => ({
        symbol: holding.tradingsymbol,
        quantity: Number(holding.quantity),
        averagePrice: Number(
          holding.average_price
        ),
        currentPrice: Number(
          holding.last_price
        ),
        previousClose: Number(
          holding.close_price
        ),
      }));
    } catch (error: any) {
      console.error(
        "Zerodha Holdings Error:",
        error
      );

      throw error;
    }
  }

  async getPositions(): Promise<Position[]> {
    const positions =
      await this.kite.getPositions();

    return positions.net.map(
      (position) => ({
        symbol: position.tradingsymbol,
        quantity: Number(
          position.quantity
        ),
        pnl: Number(position.pnl),
      })
    );
  }
}