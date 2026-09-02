import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: Number(process.env.PORT ?? '4000'),
  jwtSecret: process.env.JWT_SECRET ?? 'development-secret-key',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://postgres:postgres@localhost:5432/portfolio_analytics_db?schema=public',
  cronExpression: process.env.CRON_EXPRESSION ?? '0 16 * * 1-5',
  zerodhaApiKey: process.env.ZERODHA_API_KEY ?? '',
  zerodhaApiSecret: process.env.ZERODHA_API_SECRET ?? '',
  zerodhaRedirectUri: process.env.ZERODHA_REDIRECT_URI ?? '',
};

export default env;
