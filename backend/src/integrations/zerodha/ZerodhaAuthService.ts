import prisma from '../../prisma/client';

import { BrokerType } from '@prisma/client';

import { ZerodhaClient } from './ZerodhaClient';
import { SnapshotService } from '../../services/SnapshotService';
import { PortfolioService } from '../../services/PortfolioService';
import { ZerodhaAdapter } from '../../adapters/ZerodhaAdapter';

export interface ZerodhaOAuthRequest {
  requestToken: string;
  userId: string;
}

export interface ZerodhaOAuthResult {
  accessToken: string;
  brokerAccountId: string;
  brokerUserId: string;
}

export class ZerodhaAuthService {
  private readonly client: ZerodhaClient;

  constructor(
    private readonly apiKey: string,
    private readonly apiSecret: string,
  ) {
    this.client = new ZerodhaClient(
      apiKey
    );
  }

  getLoginUrl(): string {
    return this.client.getLoginUrl();
  }

  async connectBroker(
    input: ZerodhaOAuthRequest
  ): Promise<ZerodhaOAuthResult> {

    const session =
      await this.client.generateSession(
        input.requestToken,
        this.apiSecret
      );

    const brokerAccount =
      await prisma.brokerAccount.upsert({
        where: {
          userId_broker: {
            userId: input.userId,
            broker: BrokerType.ZERODHA,
          },
        },

        update: {
          accessToken:
            session.access_token,

          isConnected: true,

          lastSyncError: null,

          lastSyncedAt:
            new Date(),
        },

        create: {
          broker: 'ZERODHA',

          brokerUserId:
            session.user_id,

          accessToken:
            session.access_token,

          isConnected: true,

          lastSyncError: null,

          lastSyncedAt:
            new Date(),

          userId:
            input.userId,
        },
      });

    const snapshotService =
      new SnapshotService();

    const hasSnapshot =
      await snapshotService.hasSnapshotForDate(
        brokerAccount.id,
        new Date()
      );

    if (!hasSnapshot) {
      try {
        const client =
          new ZerodhaClient(
            this.apiKey,
            session.access_token
          );

        const adapter =
          new ZerodhaAdapter(
            client
          );

        const portfolioService =
          new PortfolioService(
            adapter
          );

        const snapshot =
          await portfolioService.generateSnapshot();
          console.log(
            'Generated snapshot:',
            snapshot
          );

        await snapshotService.saveDailySnapshot({
          brokerAccountId:
            brokerAccount.id,

          portfolioValue:
            snapshot.portfolioValue,

          investedValue:
            snapshot.investedValue,

          totalPnl:
            snapshot.totalPnl,

          dailyPnl:
            snapshot.dailyPnl,

          snapshotDate:
            new Date(),
        });

        console.log(
          'Catch-up snapshot saved'
        );

      } catch (error) {
        console.error(
          'Failed to create catch-up snapshot',
          error
        );
      }
    }

    return {
      accessToken:
        session.access_token,

      brokerAccountId:
        brokerAccount.id,

      brokerUserId:
        brokerAccount.brokerUserId,
    };
  }

  async getBrokerAccount(
    userId: string
  ) {
    return prisma.brokerAccount.findFirst({
      where: {
        userId,
        broker:
          BrokerType.ZERODHA,
      },
    });
  }
}