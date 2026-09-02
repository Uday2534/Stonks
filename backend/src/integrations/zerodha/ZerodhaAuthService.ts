import prisma from '../../prisma/client';

import { BrokerType } from '@prisma/client';

import { ZerodhaClient } from './ZerodhaClient';

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
            broker:
              BrokerType.ZERODHA,
          },
        },

        update: {
          accessToken:
            session.access_token,

          brokerUserId:
            session.user_id,
        },

        create: {
          broker:
            BrokerType.ZERODHA,

          brokerUserId:
            session.user_id,

          accessToken:
            session.access_token,

          userId: input.userId,
        },
      });

    return {
      accessToken:
        session.access_token,

      brokerAccountId:
        brokerAccount.id,

      brokerUserId:
        brokerAccount.brokerUserId,
    };
  }
  async getBrokerAccount(userId: string) {
    return prisma.brokerAccount.findFirst({
      where: {
        userId,
        broker: BrokerType.ZERODHA,
      },
    });
  }
}