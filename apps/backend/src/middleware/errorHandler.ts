import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  isOperational = true;
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  const drizzleMsg = (err as { code?: string; message?: string }).message;
  if (drizzleMsg && typeof drizzleMsg === 'string') {
    if ((err as { code?: string }).code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Duplicate entry' });
      return;
    }
  }
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
}
