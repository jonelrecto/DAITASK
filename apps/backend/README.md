# Backend API

Express.js REST API with Drizzle ORM and MySQL.

## Setup

See the root [README](../../README.md) for full setup (database, env, migrate, seed).

## Project Structure

```
src/
├── config/          # Database and session config
├── controllers/     # Route handlers
├── db/              # Schema, migrations, seed
├── middleware/      # Auth, validation, errors, logger, rate limit
├── routes/          # API routes
├── types/           # TypeScript types
├── tests/           # Unit and integration tests
└── server.ts        # Entry point
```

## Environment Variables

- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` – MySQL
- `SESSION_SECRET` – Session signing
- `PORT` – Server port (default 5000)
- `NODE_ENV` – development | production
- `FRONTEND_URL` – CORS origin for frontend

## Scripts

- `npm run dev` – Start with nodemon + tsx
- `npm run build` – Compile TypeScript
- `npm run start` – Run compiled JS
- `npm run db:generate` – Generate Drizzle migrations
- `npm run migrate` – Run migrations
- `npm run seed` – Seed users and sample tasks
- `npm run db:studio` – Open Drizzle Studio
- `npm test` – Unit tests
- `npm run test:integration` – Integration tests (requires DB)
