import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import { pool } from './database';

const MySQLSessionStore = MySQLStore(session);

const store = new MySQLSessionStore(
  {},
  pool as unknown as MySQLStore['connection']
);

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET ?? 'change-me',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax',
  },
});

export { store as sessionStore };
