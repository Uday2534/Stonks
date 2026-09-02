import cron from 'node-cron';

import env from '../config/env';
import { SnapshotJob } from '../jobs/SnapshotJob';
import { BenchmarkService } from '../services/BenchmarkService';
import { Logger } from '../utils/logger';

console.log('cron.ts loaded');
console.log(
  'Cron expression:',
  env.cronExpression
);

const snapshotJob = new SnapshotJob();

const benchmarkService =
  new BenchmarkService();

export const cronSchedule =
  cron.schedule(
    env.cronExpression,
    async () => {
      console.log(
        'CRON EXECUTED:',
        new Date().toISOString()
      );

      Logger.info(
        'Daily snapshot job started'
      );

      try {
        console.log(
          'Running portfolio snapshots...'
        );

        await snapshotJob.runDailySnapshotJob();

        console.log(
          'Portfolio snapshots completed'
        );

        console.log(
          'Running benchmark snapshot...'
        );

        await benchmarkService.saveDailyNiftySnapshot();

        console.log(
          'Benchmark snapshot completed'
        );

        Logger.success(
          'Daily snapshot job completed'
        );
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Unknown job error';

        console.error(
          'CRON ERROR:',
          error
        );

        Logger.error(
          'Daily snapshot job failed',
          { message }
        );
      }
    },
    {
      timezone: 'Asia/Kolkata',
    }
  );