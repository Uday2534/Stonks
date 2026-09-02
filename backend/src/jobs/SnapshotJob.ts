import prisma from '../prisma/client';

import env from '../config/env';

import { ZerodhaClient } from '../integrations/zerodha/ZerodhaClient';
import { ZerodhaAdapter } from '../adapters/ZerodhaAdapter';

import { PortfolioService } from '../services/PortfolioService';
import { SnapshotService } from '../services/SnapshotService';

import { Logger } from '../utils/logger';

export class SnapshotJob {
  constructor(
    private readonly snapshotService: SnapshotService =
      new SnapshotService(),
  ) {}

  async runDailySnapshotJob(): Promise<void> {
    const startedAt = Date.now();

    Logger.info(
      'Snapshot job started',
      { startedAt }
    );

    try {
      const brokerAccounts =
        await prisma.brokerAccount.findMany();

      if (
        brokerAccounts.length === 0
      ) {
        Logger.info(
          'No broker accounts found for snapshot processing'
        );
        return;
      }

      for (const brokerAccount of brokerAccounts) {
        try {
          if (
            brokerAccount.broker !==
            'ZERODHA'
          ) {
            Logger.info(
              'Skipping unsupported broker',
              {
                broker:
                  brokerAccount.broker,
              }
            );
            continue;
          }

          if (
            !brokerAccount.accessToken
          ) {
            Logger.error(
              'Broker account has no access token',
              {
                brokerAccountId:
                  brokerAccount.id,
              }
            );
            continue;
          }

          const client =
            new ZerodhaClient(
              env.zerodhaApiKey,
              brokerAccount.accessToken
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

          await this.snapshotService.saveDailySnapshot(
            {
              portfolioValue:
                snapshot.portfolioValue,

              investedValue:
                snapshot.investedValue,

              totalPnl:
                snapshot.totalPnl,

              dailyPnl:
                snapshot.dailyPnl,

              snapshotDate:
                snapshot.generatedAt,

              brokerAccountId:
                brokerAccount.id,
            }
          );
          await prisma.brokerAccount.update({
            where: {
              id: brokerAccount.id,
            },
            data: {
              isConnected: true,
              lastSyncedAt: new Date(),
              lastSyncError: null,
            },
          });
          Logger.success(
            'Snapshot saved for broker account',
            {
              brokerAccountId:
                brokerAccount.id,
              broker:
                brokerAccount.broker,
            }
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : 'Unknown broker processing error';
          await prisma.brokerAccount.update({
            where: {
              id: brokerAccount.id,
            },
            data: {
              isConnected: false,
              lastSyncError:
                error instanceof Error
                  ? error.message
                  : 'Unknown broker error',
            },
          });
          Logger.error(
            'Failed to process broker account',
            {
              brokerAccountId:
                brokerAccount.id,
              broker:
                brokerAccount.broker,
              message,
            }
          );
        }
      }

      const durationMs =
        Date.now() - startedAt;

      Logger.success(
        'Snapshot job finished successfully',
        {
          durationMs,
        }
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown job error';

      const durationMs =
        Date.now() - startedAt;

      Logger.error(
        'Snapshot job failed',
        {
          durationMs,
          message,
        }
      );

      throw error;
    }
  }
}