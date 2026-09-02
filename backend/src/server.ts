import app from './app';
import env from './config/env';
import { cronSchedule } from './config/cron';

const startServer = async (): Promise<void> => {
  try {
    app.listen(env.port, () => {
      console.log(`Portfolio Analytics Platform API running on port ${env.port}`);
    });

    cronSchedule.start();
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
