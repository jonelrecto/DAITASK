import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { pool } from './config/database';
import { sessionMiddleware } from './config/session';
import { requestLogger } from './middleware/logger';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import analyticsRoutes from './routes/analytics.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT ?? 5000;

const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(sessionMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/api/health', async (_req, res) => {
  try {
    const conn = await pool.getConnection();
    conn.release();
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Not found' });
});
app.use(errorHandler);

async function start() {
  try {
    await pool.getConnection();
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// Only start server when run directly (not when imported for tests)
if (process.env.VITEST !== 'true') {
  start().catch(console.error);
}

export { app };
