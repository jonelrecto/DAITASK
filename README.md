# Task Management Application

A full-stack task management application built with Vue.js, Node.js, Express, and MySQL.

## Features

- User authentication with session management
- Create, read, update, and delete tasks
- Filter tasks by status and priority
- Analytics dashboard with statistics and charts
- Responsive design for mobile and desktop
- Secure session-based authentication

## Tech Stack

### Frontend

- Vue.js 3 (Composition API)
- TypeScript
- Vite
- Pinia (state management)
- Vue Router
- Axios
- Tailwind CSS
- Chart.js / vue-chartjs
- Vitest (testing)

### Backend

- Node.js
- Express
- TypeScript
- Drizzle ORM
- MySQL
- Express Session (express-mysql-session)
- Bcrypt.js
- Vitest and Supertest (testing)

## Project Structure

```
DAITASK/
├── apps/
│   ├── backend/          # Express API
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── db/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   ├── types/
│   │   │   ├── tests/
│   │   │   └── server.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   └── frontend/         # Vue.js app
│       ├── src/
│       │   ├── components/
│       │   ├── views/
│       │   ├── stores/
│       │   ├── services/
│       │   ├── router/
│       │   ├── types/
│       │   └── main.ts
│       └── package.json
├── package.json          # Root workspace config
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm

## Installation and Setup

### 1. Clone and install

```bash
cd DAITASK
npm run install:all
```

### 2. Set up MySQL database

```sql
CREATE DATABASE task_management;
```

### 3. Configure environment variables

**Backend** – create `apps/backend/.env`:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
DB_PORT=3306
SESSION_SECRET=your-super-secret-key-change-this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend** – create `apps/frontend/.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run database migrations

```bash
npm run migrate
```

### 5. (Optional) Seed database with test data

```bash
npm run seed
```

### 6. Start the application

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173).

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

### 7. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Default Test Users

If you ran the seed script, you can log in with:

- Email: demo@example.com | Password: Demo123!
- Email: test@example.com | Password: Test123!
- Email: admin@example.com | Password: Admin123!

## API Endpoints

### Authentication

- POST `/api/auth/register` – Register new user
- POST `/api/auth/login` – Login
- POST `/api/auth/logout` – Logout
- GET `/api/auth/me` – Get current user

### Tasks

- GET `/api/tasks` – List tasks (optional query: status, priority)
- GET `/api/tasks/:id` – Get one task
- POST `/api/tasks` – Create task
- PUT `/api/tasks/:id` – Update task
- DELETE `/api/tasks/:id` – Delete task

### Analytics

- GET `/api/analytics/dashboard` – Dashboard statistics

### Health

- GET `/api/health` – Health check (DB status)

## Running Tests

### Backend

```bash
cd apps/backend
npm test
npm run test:watch
npm run test:coverage
npm run test:integration
```

(Integration tests require MySQL and the `task_management` database.)

### Frontend

```bash
cd apps/frontend
npm test
npm run test:watch
```

## Database Schema

### Users

- id, email (unique), password (hashed), createdAt, updatedAt

### Tasks

- id, userId (FK), title, description, status (Pending | In Progress | Completed), priority (Low | Medium | High), dueDate, createdAt, updatedAt

### Sessions

- session_id, expires, data

## Security

- Password hashing with bcrypt
- Session-based auth with HTTP-only cookies
- CORS and rate limiting
- Input validation (express-validator)
- SQL injection prevention via Drizzle ORM

## License

MIT
