import cors from 'cors';
import express from 'express';
import brokerRoutes from './routes/broker.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/error.middleware';
import portfolioRoutes from './routes/portfolio.routes';
import snapshotRoutes from './routes/snapshot.routes';
import benchmarkRoutes from './routes/benchmark.routes';
import analyticsRoutes from './routes/analytics.routes';


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/broker', brokerRoutes);
app.use('/api/portfolio',portfolioRoutes);
app.use('/api/snapshot', snapshotRoutes);
app.use('/api/benchmark',benchmarkRoutes);
app.use('/api/analytics',analyticsRoutes);

app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use(errorHandler);

export default app;