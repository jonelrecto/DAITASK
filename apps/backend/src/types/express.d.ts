import type { User } from './user.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Session {
      userId?: number;
    }
  }
}

export {};
