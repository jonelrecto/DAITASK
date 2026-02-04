# Task Management Application - Cursor Development Prompt
## Monorepo with Session-Based Authentication, Drizzle ORM, and Testing

---

## Phase 1: Monorepo Setup & Database Foundation

**Objective**: Set up monorepo structure, initialize the database with Drizzle ORM, and create migration system.

```
Create a task management application with MONOREPO structure:

PROJECT STRUCTURE:
/task-management-app (root)
  /apps
    /backend (Node.js + Express API)
    /frontend (Vue.js 3 with Vite)
  /packages (shared code - optional for future)
  package.json (workspace configuration)
  .gitignore
  README.md

PHASE 1 TASKS:

1. Root Monorepo Setup:
   - Initialize root package.json with workspaces:
     * "workspaces": ["apps/backend", "apps/frontend"]
   - Add root scripts:
     * "dev:backend": "npm run dev --workspace=apps/backend"
     * "dev:frontend": "npm run dev --workspace=apps/frontend"
     * "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
     * "install:all": "npm install"
     * "migrate": "npm run migrate --workspace=apps/backend"
     * "seed": "npm run seed --workspace=apps/backend"
     * "test": "npm run test --workspace=apps/backend"
   - Install root dev dependencies:
     * concurrently (to run backend and frontend simultaneously)
   - Create .gitignore at root:
     * node_modules/
     * .env
     * dist/
     * .DS_Store

2. Backend Setup (/apps/backend):
   - Initialize Node.js project
   - Install dependencies: 
     * express
     * mysql2
     * drizzle-orm
     * bcryptjs
     * express-session
     * express-mysql-session (for session store)
     * dotenv
     * cors
     * express-validator
     * cookie-parser
   
   - Install dev dependencies: 
     * nodemon
     * drizzle-kit (for migrations)
     * tsx (TypeScript execution for Node)
     * vitest (for testing)
     * supertest (for API testing)
     * @types/express
     * @types/bcryptjs
     * @types/express-session
     * @types/cookie-parser
     * @types/supertest
   
   - Create folder structure:
     /src
       /config (database config, session config)
       /db
         /schema (Drizzle schema definitions)
         /migrations (generated migrations)
       /controllers
       /routes
       /middleware
       /utils
       /tests (unit and integration tests)
     server.js or server.ts (entry point)
     drizzle.config.ts (Drizzle configuration)
   
   - Set up .env.example with: 
     * DB_HOST=localhost
     * DB_USER=root
     * DB_PASSWORD=
     * DB_NAME=task_management
     * DB_PORT=3306
     * SESSION_SECRET=your-secret-key-change-this
     * PORT=5000
     * NODE_ENV=development
     * FRONTEND_URL=http://localhost:5173

3. Database Configuration with Drizzle:
   
   - Create drizzle.config.ts:
     * Configure MySQL connection
     * Set schema path: ./src/db/schema
     * Set migrations folder: ./src/db/migrations
     * Set driver: mysql2
   
   - Create /src/config/database.ts:
     * Import mysql2/promise
     * Create MySQL connection pool
     * Export db connection and pool
   
   - Create /src/db/index.ts:
     * Import drizzle from drizzle-orm/mysql2
     * Import connection pool
     * Create and export drizzle db instance

4. Create Drizzle Schema (/src/db/schema):
   
   - Create users.schema.ts:
     * Define users table using Drizzle:
       - id: int, primary key, auto increment
       - email: varchar(255), unique, not null
       - password: varchar(255), not null
       - createdAt: timestamp, default now()
       - updatedAt: timestamp, default now(), on update now()
     * Export users table and type inference
   
   - Create sessions.schema.ts:
     * Define sessions table for express-mysql-session:
       - session_id: varchar(128), primary key
       - expires: int unsigned, not null
       - data: mediumtext
     * Export sessions table
   
   - Create tasks.schema.ts:
     * Define tasks table using Drizzle:
       - id: int, primary key, auto increment
       - userId: int, not null, foreign key to users(id)
       - title: varchar(255), not null
       - description: text, nullable
       - status: enum('Pending', 'In Progress', 'Completed'), default 'Pending'
       - priority: enum('Low', 'Medium', 'High'), default 'Medium'
       - dueDate: date, nullable
       - createdAt: timestamp, default now()
       - updatedAt: timestamp, default now(), on update now()
     * Export tasks table and type inference
   
   - Create index.ts:
     * Export all schemas
     * Define relations:
       - users → hasMany tasks
       - tasks → belongsTo user

5. Generate and Run Migrations:
   - Add scripts to backend package.json:
     * "db:generate": "drizzle-kit generate:mysql"
     * "db:push": "drizzle-kit push:mysql"
     * "db:studio": "drizzle-kit studio"
     * "migrate": "tsx src/db/migrate.ts"
   
   - Create /src/db/migrate.ts:
     * Script to run migrations programmatically
     * Import drizzle-kit migrate function
     * Run migrations on database
   
   - Generate initial migration:
     * Run: npm run db:generate
     * This creates migration files in /src/db/migrations

6. Create Seed Script (/src/db/seed.ts):
   - Create test users:
     * demo@example.com / Demo123!
     * test@example.com / Test123!
     * admin@example.com / Admin123!
   - Create sample tasks for demo user (10-15 tasks):
     * Mix of statuses (Pending, In Progress, Completed)
     * Mix of priorities (Low, Medium, High)
     * Some with due dates (including overdue)
     * Variety of descriptions
   - Hash passwords using bcryptjs
   - Insert users using Drizzle
   - Insert tasks using Drizzle
   
   - Add script to backend package.json:
     * "seed": "tsx src/db/seed.ts"

7. Backend Package.json Scripts:
   - "start": "node dist/server.js"
   - "dev": "nodemon --exec tsx src/server.ts"
   - "build": "tsc"
   - "db:generate": "drizzle-kit generate:mysql"
   - "db:push": "drizzle-kit push:mysql"
   - "db:studio": "drizzle-kit studio"
   - "migrate": "tsx src/db/migrate.ts"
   - "seed": "tsx src/db/seed.ts"
   - "test": "vitest"
   - "test:ui": "vitest --ui"

8. Create tsconfig.json for backend:
   - Target: ES2020
   - Module: CommonJS
   - Strict mode enabled
   - Path aliases: "@/*" → "./src/*"

DELIVERABLE: Working monorepo with backend skeleton and Drizzle ORM migrations ready to run.
```

---

## Phase 2: Session-Based Authentication System with Testing

**Objective**: Implement user registration, login, logout, session management, and comprehensive tests.

```
PHASE 2: Build the session-based authentication system with Drizzle ORM and testing.

TASKS:

1. Configure Express Session (/src/config/session.ts):
   - Import express-session and express-mysql-session
   - Create MySQLStore instance:
     * Use existing MySQL connection pool
     * Configure table name: 'sessions'
     * Clear expired sessions on startup
   - Configure session middleware with:
     * secret: SESSION_SECRET from .env
     * resave: false
     * saveUninitialized: false
     * store: MySQLStore instance
     * cookie settings:
       - httpOnly: true
       - secure: process.env.NODE_ENV === 'production'
       - maxAge: 24 hours (86400000 ms)
       - sameSite: 'lax' (or 'strict' for production)
   - Export configured session middleware
   - Export MySQLStore for cleanup

2. Create Authentication Middleware (/src/middleware/auth.ts):
   
   - isAuthenticated middleware:
     * Check if req.session?.userId exists
     * If not, return 401 with { message: 'Unauthorized' }
     * If yes, fetch user from database using Drizzle:
       - Select from users where id = req.session.userId
       - Exclude password from query
     * If user not found, return 401 (invalid session)
     * Attach user to req.user
     * Call next()
   
   - attachUser middleware (optional):
     * If req.session?.userId exists, fetch and attach user
     * Always call next()
   
   - Add TypeScript types:
     * Extend Express Request interface to include user property
     * Extend Express Session interface to include userId

3. Create Validation Middleware (/src/middleware/validators.ts):
   - Use express-validator
   
   - registerValidation:
     * body('email').isEmail().normalizeEmail()
     * body('password').isLength({ min: 6 })
     * body('email').custom(async email => check if exists in DB)
   
   - loginValidation:
     * body('email').isEmail().normalizeEmail()
     * body('password').notEmpty()
   
   - validationErrorHandler:
     * Check validationResult(req)
     * If errors, return 400 with errors array
     * Otherwise call next()

4. Create Auth Controller (/src/controllers/authController.ts):
   - Import Drizzle db and schemas
   - Import bcryptjs
   
   - register:
     * Extract email and password
     * Hash password: await bcrypt.hash(password, 10)
     * Insert user using Drizzle:
       - db.insert(users).values({ email, password: hashedPassword })
     * Handle duplicate email error
     * Return 201 with { message: 'User created successfully' }
   
   - login:
     * Extract email and password
     * Query user: db.select().from(users).where(eq(users.email, email))
     * If user not found, return 401
     * Compare password: await bcrypt.compare(password, user.password)
     * If password invalid, return 401
     * Store user ID in session:
       - req.session.userId = user.id
       - Wrap in Promise to handle session save
     * Return 200 with user object (exclude password)
   
   - logout:
     * Destroy session: req.session.destroy()
     * Clear cookie: res.clearCookie('connect.sid')
     * Return 200 with { message: 'Logged out successfully' }
   
   - getCurrentUser:
     * Return req.user (already attached by middleware)
     * Exclude password field
     * Return 200

5. Create Auth Routes (/src/routes/auth.routes.ts):
   - Import express Router
   - Import authController and middleware
   
   - POST /register (registerValidation, validationErrorHandler, register)
   - POST /login (loginValidation, validationErrorHandler, login)
   - POST /logout (isAuthenticated, logout)
   - GET /me (isAuthenticated, getCurrentUser)
   
   - Export router

6. Create Server (/src/server.ts):
   - Import dependencies
   - Create Express app
   - Configure CORS:
     * origin: process.env.FRONTEND_URL || 'http://localhost:5173'
     * credentials: true
     * methods: ['GET', 'POST', 'PUT', 'DELETE']
   
   - Configure middleware (in order):
     * express.json()
     * express.urlencoded({ extended: true })
     * cookie-parser()
     * CORS middleware
     * Session middleware
   
   - Connect to database
   - Test database connection
   
   - Mount routes:
     * app.use('/api/auth', authRoutes)
   
   - Add 404 handler
   - Add error handling middleware
   
   - Start server:
     * Listen on PORT from .env
     * Log server URL and environment
   
   - Export app for testing

7. Error Handling (/src/middleware/errorHandler.ts):
   - Create AppError class extending Error:
     * Properties: statusCode, isOperational
   
   - errorHandler middleware:
     * Log error in development
     * If AppError: return { message, statusCode }
     * If Drizzle error: parse and return appropriate message
     * If validation error: return 400
     * Default: return 500 internal server error
     * Never expose stack traces in production

8. Create Type Definitions (/src/types):
   
   - express.d.ts:
     * Extend Express.Request:
       - user?: User (exclude password)
     * Extend Express.Session:
       - userId?: number
   
   - user.types.ts:
     * Export User type from Drizzle schema
     * Export UserWithoutPassword type
     * Export CreateUserDTO, LoginDTO

9. Create Unit Tests (/src/tests/unit):
   
   - auth.test.ts:
     * Test password hashing
     * Test password comparison
     * Test session creation
     * Test user creation with Drizzle
     * Mock database calls
   
   - Use Vitest for testing
   - Setup test database or use mocks

10. Create Integration Tests (/src/tests/integration):
    
    - auth.integration.test.ts:
      * Setup: create test database, run migrations
      * Teardown: clear tables, close connections
      
      * Test POST /api/auth/register:
        - Can register with valid data
        - Cannot register with duplicate email
        - Cannot register with invalid email
        - Cannot register with short password
        - Password is hashed in database
      
      * Test POST /api/auth/login:
        - Can login with correct credentials
        - Cannot login with wrong password
        - Cannot login with non-existent email
        - Session cookie is set after login
        - Returns user data without password
      
      * Test GET /api/auth/me:
        - Returns user when authenticated
        - Returns 401 when not authenticated
        - Returns correct user data
      
      * Test POST /api/auth/logout:
        - Can logout when authenticated
        - Session is destroyed
        - Cannot access protected routes after logout
        - Returns 401 when not authenticated
      
      * Test session persistence:
        - Session survives server restart (in DB)
        - Session expires after maxAge
        - Session is destroyed on logout
    
    - Use supertest for HTTP requests
    - Use test users from seed data
    - Clean database between tests

11. Create Test Utilities (/src/tests/utils):
    
    - testDb.ts:
      * Setup test database connection
      * Run migrations for tests
      * Clear all tables function
      * Seed test data function
      * Close connection function
    
    - testHelpers.ts:
      * createTestUser() - returns user and plaintext password
      * loginTestUser() - returns session cookie
      * makeAuthRequest() - supertest with session cookie
      * clearTestData()

12. Update package.json scripts:
    - "test": "vitest"
    - "test:watch": "vitest --watch"
    - "test:ui": "vitest --ui"
    - "test:coverage": "vitest --coverage"
    - "test:integration": "vitest run --config vitest.integration.config.ts"

13. Create vitest.config.ts:
    - Configure test environment
    - Setup test database
    - Configure coverage thresholds
    - Setup global test utilities

IMPORTANT SESSION NOTES:
- Sessions stored in MySQL using express-mysql-session
- Session cookies sent automatically by browser
- Frontend must use credentials: 'include'
- Session expires after 24 hours
- Session destroyed on logout
- TypeScript ensures type safety for session data

TESTING CHECKLIST:
✓ UNIT TESTS:
- [ ] Password hashing works correctly
- [ ] Password comparison works
- [ ] User creation with Drizzle works

✓ INTEGRATION TESTS:
- [ ] Can register new user
- [ ] Cannot register duplicate email
- [ ] Password is hashed in database
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong credentials
- [ ] Session cookie is set after login
- [ ] Can access protected route with valid session
- [ ] Cannot access protected route without session
- [ ] Can logout and session is destroyed
- [ ] Session persists across server restarts
- [ ] Returns user data without password
- [ ] Validation errors are handled correctly
- [ ] 401 for invalid sessions

DELIVERABLE: Working session-based authentication with comprehensive unit and integration tests.
```

---

## Phase 3: Task Management Backend with Testing

**Objective**: Create CRUD operations for tasks with filtering capabilities and comprehensive tests.

```
PHASE 3: Implement task management API endpoints with Drizzle ORM and testing.

TASKS:

1. Create Task Controller (/src/controllers/taskController.ts):
   - Import Drizzle db and schemas
   - Import operators: eq, and, desc
   
   - getAllTasks:
     * Extract query params: status, priority
     * Build where conditions array:
       - Always include eq(tasks.userId, req.user.id)
       - If status provided: add eq(tasks.status, status)
       - If priority provided: add eq(tasks.priority, priority)
     * Query tasks using Drizzle:
       - db.select().from(tasks).where(and(...conditions)).orderBy(desc(tasks.createdAt))
     * Return tasks array with 200 status
     * Handle errors appropriately
   
   - getTaskById:
     * Extract task id from params
     * Query single task using Drizzle:
       - db.select().from(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)))
     * Return 404 if task not found
     * Return task with 200 status
   
   - createTask:
     * Extract: title, description, status, priority, dueDate from body
     * Insert task using Drizzle:
       - db.insert(tasks).values({
           userId: req.user.id,
           title,
           description,
           status: status || 'Pending',
           priority: priority || 'Medium',
           dueDate
         })
     * Return created task with 201 status
     * Handle validation errors
   
   - updateTask:
     * Extract task id from params
     * Verify task ownership using Drizzle
     * Extract fields to update from body
     * Update task using Drizzle:
       - db.update(tasks).set(updateData).where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)))
     * Fetch and return updated task with 200 status
     * Return 404 if task not found
   
   - deleteTask:
     * Extract task id from params
     * Delete task using Drizzle:
       - db.delete(tasks).where(and(eq(tasks.id, id), eq(tasks.userId, req.user.id)))
     * Return 204 status (no content)
     * Return 404 if task not found or not owned by user

2. Create Task Validation Middleware (/src/middleware/taskValidators.ts):
   - Use express-validator
   
   - validateTaskCreate:
     * body('title').trim().notEmpty().isLength({ max: 255 })
     * body('description').optional().trim()
     * body('status').optional().isIn(['Pending', 'In Progress', 'Completed'])
     * body('priority').optional().isIn(['Low', 'Medium', 'High'])
     * body('dueDate').optional().isISO8601().toDate()
   
   - validateTaskUpdate:
     * All fields optional
     * Same validations as create
     * Custom validator: at least one field must be provided
   
   - validateTaskId:
     * param('id').isInt({ min: 1 })
   
   - validationErrorHandler (reuse from auth)

3. Create Task Routes (/src/routes/task.routes.ts):
   - Import express Router
   - Import taskController and middleware
   - All routes protected with isAuthenticated middleware
   
   - GET / (optional query params: status, priority)
   - GET /:id (validateTaskId, validationErrorHandler)
   - POST / (validateTaskCreate, validationErrorHandler)
   - PUT /:id (validateTaskId, validateTaskUpdate, validationErrorHandler)
   - DELETE /:id (validateTaskId, validationErrorHandler)
   
   - Export router

4. Mount Task Routes in server.ts:
   - app.use('/api/tasks', isAuthenticated, taskRoutes)

5. Create Task Type Definitions (/src/types/task.types.ts):
   - Export Task type from Drizzle schema
   - Export CreateTaskDTO
   - Export UpdateTaskDTO
   - Export TaskFilters interface
   - Export TaskStatus and TaskPriority enums

6. Create Unit Tests (/src/tests/unit/task.test.ts):
   - Test task creation logic
   - Test task filtering logic
   - Test date validation
   - Test ownership verification
   - Mock Drizzle calls

7. Create Integration Tests (/src/tests/integration/task.integration.test.ts):
   - Setup: create test users and login
   - Teardown: clear tasks table
   
   - Test GET /api/tasks:
     * Returns empty array when no tasks
     * Returns user's tasks only
     * Does not return other users' tasks
     * Filters by status correctly
     * Filters by priority correctly
     * Combines filters correctly
     * Orders by createdAt DESC
     * Requires authentication
   
   - Test GET /api/tasks/:id:
     * Returns task when exists and owned by user
     * Returns 404 when task doesn't exist
     * Returns 404 when task belongs to another user
     * Requires authentication
   
   - Test POST /api/tasks:
     * Creates task with required fields only
     * Creates task with all fields
     * Sets default status to 'Pending'
     * Sets default priority to 'Medium'
     * Associates task with authenticated user
     * Returns 400 without title
     * Returns 400 with invalid status
     * Returns 400 with invalid priority
     * Returns 400 with invalid date format
     * Requires authentication
   
   - Test PUT /api/tasks/:id:
     * Updates task title
     * Updates task description
     * Updates task status
     * Updates task priority
     * Updates task dueDate
     * Updates multiple fields at once
     * Returns 404 when task doesn't exist
     * Returns 404 when task belongs to another user
     * Returns 400 when no fields provided
     * Returns 400 with invalid status
     * Requires authentication
   
   - Test DELETE /api/tasks/:id:
     * Deletes task successfully
     * Returns 204 status
     * Returns 404 when task doesn't exist
     * Returns 404 when task belongs to another user
     * Task is removed from database
     * Requires authentication
   
   - Test authorization:
     * User A cannot access User B's tasks
     * User A cannot update User B's tasks
     * User A cannot delete User B's tasks

8. Create Test Utilities for Tasks:
   - createTestTask(userId, data) - creates task in test DB
   - createMultipleTestTasks(userId, count) - creates multiple tasks
   - clearUserTasks(userId) - removes all user's tasks

TESTING CHECKLIST:
✓ UNIT TESTS:
- [ ] Task creation logic works
- [ ] Filter building works correctly
- [ ] Date validation works

✓ INTEGRATION TESTS:
- [ ] Can create task with required fields
- [ ] Cannot create task without title
- [ ] Can create task with all fields
- [ ] Defaults are set correctly
- [ ] Can get all user's tasks
- [ ] Tasks are filtered by status correctly
- [ ] Tasks are filtered by priority correctly
- [ ] Can filter by multiple criteria
- [ ] Can get single task by ID
- [ ] Cannot get other user's task
- [ ] Can update own task
- [ ] Cannot update task without authentication
- [ ] Cannot update other user's task
- [ ] Can delete own task
- [ ] Cannot delete other user's task
- [ ] Returns appropriate errors for invalid data
- [ ] All endpoints require authentication

DELIVERABLE: Complete task CRUD API with filtering, proper authorization, and comprehensive tests.
```

---

## Phase 4: Analytics Endpoint with Testing

**Objective**: Create dashboard analytics endpoint with aggregated statistics and tests.

```
PHASE 4: Implement analytics/dashboard endpoint with Drizzle ORM and testing.

TASKS:

1. Create Analytics Controller (/src/controllers/analyticsController.ts):
   - Import Drizzle db, schemas, and operators
   - Import sql from drizzle-orm for raw SQL if needed
   
   - getDashboardStats:
     * Fetch all tasks for authenticated user
     * Perform aggregation queries using Drizzle:
     
     a) Total tasks count:
        - db.select({ count: count() }).from(tasks).where(eq(tasks.userId, req.user.id))
     
     b) Count by status:
        - db.select({
            status: tasks.status,
            count: count()
          }).from(tasks)
          .where(eq(tasks.userId, req.user.id))
          .groupBy(tasks.status)
        - Transform result into object: { Pending: X, 'In Progress': Y, Completed: Z }
     
     c) Count by priority:
        - Similar query grouped by priority
        - Transform result into object: { Low: X, Medium: Y, High: Z }
     
     d) Overdue tasks:
        - Count tasks where:
          * dueDate < today
          * status !== 'Completed'
          * userId === req.user.id
        - Use lt() and ne() operators
     
     e) Completed this week:
        - Calculate date 7 days ago
        - Count tasks where:
          * status === 'Completed'
          * updatedAt >= 7 days ago
          * userId === req.user.id
        - Use gte() operator
     
     f) Completion rate:
        - Calculate: (completed / total) * 100
        - Round to 2 decimal places
        - Handle edge case: return 0 if total === 0
     
     * Return structured analytics object with 200 status
     * Handle errors appropriately

2. Create Analytics Routes (/src/routes/analytics.routes.ts):
   - Import express Router
   - Import analyticsController
   - GET /dashboard (protected with isAuthenticated)
   - Export router

3. Mount Analytics Routes in server.ts:
   - app.use('/api/analytics', isAuthenticated, analyticsRoutes)

4. Create Analytics Type Definitions (/src/types/analytics.types.ts):
   - Export DashboardStats interface:
     * totalTasks: number
     * byStatus: { Pending: number, 'In Progress': number, Completed: number }
     * byPriority: { Low: number, Medium: number, High: number }
     * overdueTasks: number
     * completedThisWeek: number
     * completionRate: number

5. Create Unit Tests (/src/tests/unit/analytics.test.ts):
   - Test completion rate calculation:
     * Returns 0 when no tasks
     * Returns correct percentage
     * Rounds to 2 decimal places
   - Test overdue task logic
   - Test date calculations for "this week"

6. Create Integration Tests (/src/tests/integration/analytics.integration.test.ts):
   - Setup: create test user, create variety of test tasks
   - Teardown: clear tasks
   
   - Test GET /api/analytics/dashboard:
     * Returns correct structure
     * Returns 0 for all counts when no tasks
     * Counts total tasks correctly
     * Counts by status correctly:
       - Create tasks with different statuses
       - Verify counts match
     * Counts by priority correctly:
       - Create tasks with different priorities
       - Verify counts match
     * Counts overdue tasks correctly:
       - Create tasks with past due dates (not completed)
       - Create tasks with past due dates (completed) - should not count
       - Create tasks with future due dates - should not count
       - Verify overdue count
     * Counts completed this week correctly:
       - Create tasks completed within last 7 days
       - Create tasks completed 8+ days ago
       - Verify count
     * Calculates completion rate correctly:
       - Create 10 tasks: 4 completed, 6 not completed
       - Verify rate is 40%
     * Only includes user's own tasks:
       - Create another user with tasks
       - Verify stats only include authenticated user's tasks
     * Requires authentication:
       - Returns 401 without session

7. Create Test Data Builders (/src/tests/builders):
   - taskBuilder.ts:
     * withStatus(status) - sets task status
     * withPriority(priority) - sets task priority
     * withDueDate(date) - sets due date
     * overdue() - sets due date to past
     * completedThisWeek() - sets status completed, updated recently
     * build() - returns task data
     * create(userId) - inserts into DB and returns task

8. Response Format Example:
{
  "success": true,
  "data": {
    "totalTasks": 25,
    "byStatus": {
      "Pending": 8,
      "In Progress": 7,
      "Completed": 10
    },
    "byPriority": {
      "Low": 5,
      "Medium": 12,
      "High": 8
    },
    "overdueTasks": 3,
    "completedThisWeek": 5,
    "completionRate": 40.00
  }
}

TESTING CHECKLIST:
✓ UNIT TESTS:
- [ ] Completion rate calculated correctly
- [ ] Handles zero tasks (no division by zero)
- [ ] Overdue logic is correct
- [ ] This week calculation is accurate

✓ INTEGRATION TESTS:
- [ ] Analytics endpoint requires authentication
- [ ] Returns correct structure
- [ ] Returns zeros when no tasks
- [ ] Total task count is accurate
- [ ] Status breakdown is accurate
- [ ] Priority breakdown is accurate
- [ ] Overdue tasks calculated correctly
- [ ] Completed this week is accurate
- [ ] Completion rate is correct
- [ ] Only shows user's own task statistics
- [ ] Does not include other users' data

DELIVERABLE: Working analytics endpoint with comprehensive statistics and thorough tests.
```

---

## Phase 5: Frontend Setup & Authentication UI

**Objective**: Set up Vue.js frontend in monorepo with login and registration pages.

```
PHASE 5: Create Vue.js frontend with session-based authentication UI in monorepo.

TASKS:

1. Initialize Vue.js Project (/apps/frontend):
   - Create Vue 3 project using Vite:
     * npm create vite@latest frontend -- --template vue-ts
   - Move into apps/frontend structure
   - Install dependencies: 
     * vue-router
     * axios
     * pinia
     * @pinia/testing (dev dependency)
     * vitest (dev dependency)
     * @vue/test-utils (dev dependency)
     * happy-dom or jsdom (dev dependency for testing)
   
   - Install Tailwind CSS:
     * npm install -D tailwindcss postcss autoprefixer
     * npx tailwindcss init -p
   
   - Configure Tailwind (tailwind.config.js):
     * content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}']
     * theme: customize colors if needed
   
   - Create src/assets/styles/main.css:
     * @tailwind base;
     * @tailwind components;
     * @tailwind utilities;

2. Project Structure (/apps/frontend/src):
   /assets
     /styles (CSS files)
   /components
     /common (reusable components)
     /auth (authentication-specific components)
     /tasks (task-specific components)
   /views (page components)
   /router
   /stores (Pinia stores)
   /services (API services)
   /types (TypeScript types)
   /composables (Vue composables)
   /utils (helper functions)
   /tests (frontend tests)
   main.ts
   App.vue

3. Configure Environment (.env):
   - Create .env file:
     * VITE_API_URL=http://localhost:5000/api
   - Create .env.example with same keys
   - Use import.meta.env.VITE_API_URL in code

4. Create API Service (/src/services/api.ts):
   - Import axios
   - Configure axios instance:
     * baseURL: import.meta.env.VITE_API_URL
     * withCredentials: true (CRITICAL for sessions)
     * timeout: 10000
     * headers: { 'Content-Type': 'application/json' }
   
   - Add response interceptor:
     * Handle 401 errors (session expired):
       - Import router
       - Clear auth store
       - Redirect to /login
       - Show error message
     * Handle network errors
     * Handle server errors (500)
   
   - Add request interceptor (optional):
     * Log requests in development
     * Add timestamp to requests
   
   - Export configured axios instance

5. Create Type Definitions (/src/types):
   
   - user.types.ts:
     * export interface User {
         id: number
         email: string
         createdAt: string
         updatedAt: string
       }
     * export interface LoginCredentials {
         email: string
         password: string
       }
     * export interface RegisterCredentials {
         email: string
         password: string
       }
   
   - api.types.ts:
     * export interface ApiResponse<T> {
         success: boolean
         data: T
         message?: string
       }
     * export interface ApiError {
         message: string
         errors?: Record<string, string[]>
       }

6. Create Auth Service (/src/services/authService.ts):
   - Import api instance
   - Import types
   
   - async register(credentials: RegisterCredentials):
     * POST /auth/register
     * Return response data
     * Type: Promise<ApiResponse<{message: string}>>
   
   - async login(credentials: LoginCredentials):
     * POST /auth/login
     * Return user data
     * Type: Promise<ApiResponse<{user: User}>>
   
   - async logout():
     * POST /auth/logout
     * Return success message
     * Type: Promise<ApiResponse<{message: string}>>
   
   - async getCurrentUser():
     * GET /auth/me
     * Return user data
     * Type: Promise<ApiResponse<{user: User}>>

7. Create Auth Store (/src/stores/auth.ts):
   - Import defineStore from pinia
   - Import types
   
   - State:
     * user: User | null
     * isAuthenticated: boolean
     * loading: boolean
     * error: string | null
   
   - Actions:
     * async register(credentials):
       - Set loading true
       - Try to register via authService
       - Set loading false
       - Return success
       - Catch and set error
     
     * async login(credentials):
       - Set loading true
       - Try to login via authService
       - On success: set user and isAuthenticated = true
       - Set loading false
       - Return success
       - Catch and set error
     
     * async logout():
       - Try to logout via authService
       - Clear user and set isAuthenticated = false
       - Clear session (handled by backend)
       - Catch errors
     
     * async checkAuth():
       - Try to get current user
       - If successful: set user and isAuthenticated = true
       - If fails (401): clear authentication state
       - Used on app initialization
       - Silent failure (don't show error to user)
     
     * clearError():
       - Set error to null
   
   - Getters:
     * currentUser: (state) => state.user
     * isLoading: (state) => state.loading
     * authError: (state) => state.error

8. Create Reusable Components (/src/components/common):
   
   - FormInput.vue:
     * Props:
       - modelValue: string
       - type: 'text' | 'email' | 'password'
       - label: string
       - placeholder?: string
       - error?: string
       - required?: boolean
       - disabled?: boolean
     * Emits: update:modelValue
     * Template:
       - Label with required indicator
       - Input field with proper styling
       - Error message display (red text)
     * Styling:
       - Tailwind classes
       - Focus states
       - Error state (red border)
       - Disabled state
   
   - Button.vue:
     * Props:
       - type?: 'button' | 'submit'
       - variant?: 'primary' | 'secondary' | 'danger'
       - loading?: boolean
       - disabled?: boolean
       - fullWidth?: boolean
     * Slot: default (button text)
     * Template:
       - Button element with conditional classes
       - Loading spinner when loading
       - Disabled state when loading or disabled
     * Styling:
       - Primary: blue background
       - Secondary: gray background
       - Danger: red background
       - Hover and focus states
       - Disabled styling
   
   - Card.vue:
     * Props:
       - title?: string
       - class?: string
     * Slots: default, header, footer
     * Template:
       - Card container with shadow
       - Optional header with title
       - Content area (default slot)
       - Optional footer
     * Styling: Tailwind card with shadow and rounded corners

9. Create Auth Views:
   
   - LoginView.vue (/src/views/LoginView.vue):
     * Composition API setup
     * Reactive form state:
       - email: ref('')
       - password: ref('')
       - errors: reactive({email: '', password: ''})
     * Import and use authStore
     * Import router for navigation
     
     * clientValidation():
       - Clear previous errors
       - Validate email format
       - Validate password not empty
       - Return true if valid
     
     * async handleSubmit():
       - Validate form
       - Call authStore.login()
       - On success:
         * Show success message (toast)
         * Redirect to /dashboard
       - On error:
         * Display error message
         * Handle validation errors
     
     * Template:
       - Centered card layout
       - App title/logo
       - Form with @submit.prevent="handleSubmit"
       - FormInput for email
       - FormInput for password (type="password")
       - Button (type="submit", loading state)
       - Link to register page
       - Error display area
     
     * Styling:
       - Full height center layout
       - Max width card (md:max-w-md)
       - Gradient background
       - Professional spacing
   
   - RegisterView.vue (/src/views/RegisterView.vue):
     * Similar structure to LoginView
     * Additional form field:
       - confirmPassword: ref('')
     * Additional validation:
       - Password min 6 characters
       - Passwords match
       - Email format
     
     * async handleSubmit():
       - Validate form
       - Call authStore.register()
       - On success:
         * Show success message
         * Wait 2 seconds
         * Redirect to /login
       - On error:
         * Display error
     
     * Template:
       - Similar to LoginView
       - Add confirmPassword field
       - Link to login page
     
     * Styling: consistent with LoginView

10. Set Up Router (/src/router/index.ts):
    - Import createRouter, createWebHistory
    - Import views
    - Import authStore
    
    - Define routes:
      * { path: '/', redirect: '/dashboard' }
      * {
          path: '/login',
          component: LoginView,
          meta: { requiresGuest: true }
        }
      * {
          path: '/register',
          component: RegisterView,
          meta: { requiresGuest: true }
        }
      * {
          path: '/dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true }
        }
      * {
          path: '/analytics',
          component: () => import('../views/AnalyticsView.vue'),
          meta: { requiresAuth: true }
        }
      * {
          path: '/:pathMatch(.*)*',
          component: () => import('../views/NotFoundView.vue')
        }
    
    - Create router instance
    
    - Navigation guard (router.beforeEach):
      * Get authStore
      * const requiresAuth = to.meta.requiresAuth
      * const requiresGuest = to.meta.requiresGuest
      * const isAuthenticated = authStore.isAuthenticated
      
      * If requiresAuth && !isAuthenticated:
        - Redirect to /login
      * If requiresGuest && isAuthenticated:
        - Redirect to /dashboard
      * Otherwise allow navigation
    
    - Export router

11. Create App.vue:
    - Template:
      * <div id="app">
      *   <router-view />
      * </div>
    - Style:
      * Import main.css
      * Set full height
      * Set background color
    - No navigation yet (add in Phase 6)

12. Configure main.ts:
    - Import { createApp } from 'vue'
    - Import { createPinia } from 'pinia'
    - Import router
    - Import App from './App.vue'
    - Import './assets/styles/main.css'
    
    - const pinia = createPinia()
    - const app = createApp(App)
    
    - app.use(pinia)
    - app.use(router)
    
    - Initialize auth (check session):
      * import { useAuthStore } from './stores/auth'
      * const authStore = useAuthStore()
      * await authStore.checkAuth()
    
    - app.mount('#app')

13. Update package.json scripts:
    - "dev": "vite"
    - "build": "vue-tsc && vite build"
    - "preview": "vite preview"
    - "test": "vitest"
    - "test:ui": "vitest --ui"
    - "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx"

14. Configure Vite (vite.config.ts):
    - Import vue plugin
    - Import path for aliases
    - Configure:
      * plugins: [vue()]
      * resolve: { alias: { '@': path.resolve(__dirname, './src') } }
      * server: { port: 5173, proxy if needed }

15. Create Frontend Tests (/src/tests):
    
    - auth.store.test.ts:
      * Setup: create pinia instance
      * Test register action
      * Test login action
      * Test logout action
      * Test checkAuth action
      * Test state updates
      * Mock authService
    
    - LoginView.test.ts:
      * Test component renders
      * Test form validation
      * Test successful login
      * Test failed login
      * Test error display
      * Mock router and store

16. Configure TypeScript (tsconfig.json):
    - compilerOptions:
      * target: "ES2020"
      * module: "ESNext"
      * strict: true
      * jsx: "preserve"
      * moduleResolution: "bundler"
      * paths: { "@/*": ["./src/*"] }

IMPORTANT SESSION NOTES FOR FRONTEND:
- Must use withCredentials: true in axios config
- Session cookie automatically sent by browser
- No need to manually manage tokens
- Call checkAuth() on app initialization
- Session validated on backend for each request

TESTING CHECKLIST:
✓ SETUP:
- [ ] Vite dev server runs on port 5173
- [ ] Tailwind CSS is working
- [ ] Vue Router is configured
- [ ] Pinia store is configured
- [ ] API service connects to backend

✓ AUTHENTICATION UI:
- [ ] Can access /login page
- [ ] Login form renders correctly
- [ ] Client-side validation works
- [ ] Can submit login form
- [ ] Loading state shows during login
- [ ] Error messages display correctly
- [ ] Can access /register page
- [ ] Register form renders correctly
- [ ] Password confirmation works
- [ ] Can submit registration form
- [ ] Success message shows after registration
- [ ] Redirects to login after registration

✓ ROUTING:
- [ ] Unauthenticated users redirected from dashboard
- [ ] Authenticated users redirected from login
- [ ] Navigation guards work correctly
- [ ] 404 page for invalid routes

✓ SESSION MANAGEMENT:
- [ ] Session persists on page refresh
- [ ] checkAuth() restores session
- [ ] Logout clears session
- [ ] Expired sessions handled correctly

✓ TESTS:
- [ ] Auth store tests pass
- [ ] Component tests pass
- [ ] All test suites run successfully

DELIVERABLE: Working Vue.js frontend with authentication UI, routing, and tests in monorepo structure.
```

---

## Phase 6: Task Management UI

**Objective**: Create task list, task form, and task filtering interface.

```
PHASE 6: Build comprehensive task management interface.

TASKS:

1. Create Task Service (/services/taskService.js):
   - Import api from api.js
   
   - async getTasks(filters = {}):
     * Build query params from filters object
     * GET /tasks with query params
     * Return tasks array
   
   - async getTaskById(id):
     * GET /tasks/:id
     * Return single task
   
   - async createTask(taskData):
     * POST /tasks with task data
     * Return created task
   
   - async updateTask(id, taskData):
     * PUT /tasks/:id with updated data
     * Return updated task
   
   - async deleteTask(id):
     * DELETE /tasks/:id
     * Return success response

2. Create Task Store (/stores/task.js):
   - State:
     * tasks: []
     * loading: false
     * error: null
     * filters: { status: '', priority: '' }
   
   - Actions:
     * async fetchTasks():
       - Set loading true
       - Call taskService.getTasks(state.filters)
       - Update tasks array
       - Set loading false
       - Handle errors
     
     * async createTask(taskData):
       - Call taskService.createTask()
       - Add new task to tasks array
       - Return created task
       - Handle errors
     
     * async updateTask(id, taskData):
       - Call taskService.updateTask()
       - Update task in tasks array
       - Return updated task
       - Handle errors
     
     * async deleteTask(id):
       - Call taskService.deleteTask()
       - Remove task from tasks array
       - Handle errors
     
     * setFilters(filters):
       - Update filters state
       - Call fetchTasks() with new filters
   
   - Getters:
     * taskCount: return state.tasks.length
     * pendingTasks: filter by status 'Pending'
     * inProgressTasks: filter by status 'In Progress'
     * completedTasks: filter by status 'Completed'

3. Create Reusable Components:
   
   - StatusBadge.vue:
     * Props: status
     * Display status with color-coded badge
     * Colors:
       - Pending: yellow (bg-yellow-100, text-yellow-800)
       - In Progress: blue (bg-blue-100, text-blue-800)
       - Completed: green (bg-green-100, text-green-800)
     * Rounded pill design
   
   - PriorityBadge.vue:
     * Props: priority
     * Display priority with color-coded badge
     * Colors:
       - Low: green (bg-green-100, text-green-800)
       - Medium: orange (bg-orange-100, text-orange-800)
       - High: red (bg-red-100, text-red-800)
     * Small badge with icon or text
   
   - Modal.vue:
     * Props: isOpen, title
     * Emits: close
     * Slots: default (modal content)
     * Overlay with centered modal
     * Close button (X)
     * Click outside to close
     * Escape key to close
     * Tailwind styled with backdrop
   
   - ConfirmDialog.vue:
     * Props: isOpen, title, message
     * Emits: confirm, cancel
     * Modal for confirmation (delete, etc.)
     * Confirm and cancel buttons
     * Danger styling for confirm button
   
   - EmptyState.vue:
     * Props: message, actionText, icon
     * Emits: action
     * Display when no tasks
     * Icon/illustration
     * Message
     * Optional action button

4. Create Task Components:
   
   - TaskCard.vue:
     * Props: task
     * Emits: edit, delete
     * Display single task in card format:
       - Title (bold, large)
       - Description (truncated if long)
       - Status badge
       - Priority badge
       - Due date (formatted, show overdue in red)
       - Created date
     * Action buttons:
       - Edit icon button
       - Delete icon button
     * Hover effects
     * Responsive card design
     * Overdue indicator if past due date
   
   - TaskList.vue:
     * Props: tasks, loading
     * Emits: edit-task, delete-task
     * Display tasks in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
     * Use TaskCard for each task
     * Loading spinner when loading
     * EmptyState when no tasks
     * Pass through edit/delete events
   
   - TaskForm.vue:
     * Props: task (null for create, object for edit), isOpen
     * Emits: close, submit
     * Form fields:
       - Title (required, text input)
       - Description (textarea)
       - Status (select dropdown)
       - Priority (select dropdown)
       - Due Date (date input)
     * Form validation:
       - Title required
       - Valid status/priority values
     * Populate fields if editing existing task
     * Submit handler:
       - Validate form
       - Emit submit event with form data
       - Show loading state on submit button
     * Cancel button
     * Use Modal component
     * Styled with Tailwind
   
   - TaskFilters.vue:
     * Props: currentFilters
     * Emits: filter-change
     * Filter controls:
       - Status dropdown (All, Pending, In Progress, Completed)
       - Priority dropdown (All, Low, Medium, High)
       - Clear all filters button
     * Emit filter changes immediately
     * Show active filter count
     * Responsive layout

5. Create DashboardView.vue:
   - Template structure:
     * Header section:
       - Page title "My Tasks"
       - "Create Task" button (primary, with + icon)
     * Filters section:
       - TaskFilters component
     * Main content:
       - TaskList component
     * Modals:
       - TaskForm modal (for create/edit)
       - ConfirmDialog modal (for delete)
   
   - Script logic:
     * Import task store
     * Reactive state:
       - showTaskForm: false
       - taskToEdit: null
       - showDeleteConfirm: false
       - taskToDelete: null
     
     * On mounted:
       - Fetch tasks from store
     
     * Methods:
       - openCreateForm():
         * Set taskToEdit to null
         * Set showTaskForm to true
       
       - openEditForm(task):
         * Set taskToEdit to task
         * Set showTaskForm to true
       
       - closeTaskForm():
         * Set showTaskForm to false
         * Clear taskToEdit after animation
       
       - handleTaskSubmit(taskData):
         * If editing: call taskStore.updateTask()
         * If creating: call taskStore.createTask()
         * Show success message
         * Close form
         * Refresh task list
       
       - openDeleteConfirm(task):
         * Set taskToDelete to task
         * Set showDeleteConfirm to true
       
       - handleDeleteConfirm():
         * Call taskStore.deleteTask(taskToDelete.id)
         * Show success message
         * Close confirmation dialog
         * Refresh task list
       
       - handleFilterChange(filters):
         * Call taskStore.setFilters(filters)
     
     * Computed:
       - tasks: from taskStore
       - loading: from taskStore
   
   - Styling:
     * Full page layout
     * Padding and spacing
     * Responsive design

6. Create Navigation Component (/components/AppHeader.vue):
   - Template:
     * Navigation bar (fixed or sticky)
     * Left side:
       - App logo/name "Task Manager"
       - Navigation links (Dashboard, Analytics)
     * Right side:
       - User email display
       - Logout button
   
   - Script:
     * Import auth store
     * Logout handler:
       - Call authStore.logout()
       - Show success message
       - Redirect to login
   
   - Styling:
     * Tailwind navbar
     * Responsive (hamburger menu on mobile)
     * Active link highlighting

7. Update App.vue:
   - Import AppHeader
   - Conditional rendering:
     * Show AppHeader if authenticated
     * Hide on login/register pages
   - Layout:
     * Header (if authenticated)
     * Main content area with router-view
   - Use v-if based on route meta or auth state

8. Add Toast Notifications:
   - Create ToastNotification.vue component:
     * Props: message, type (success, error, info)
     * Auto-dismiss after 3 seconds
     * Animated entry/exit
     * Positioned fixed top-right
   
   - Create useToast composable:
     * Manage toast state
     * showToast(message, type) function
     * Export for use in components

9. Styling Guidelines:
   - Consistent spacing (p-4, p-6, mb-4, etc.)
   - Card shadows for depth
   - Rounded corners (rounded-lg)
   - Hover effects on interactive elements
   - Focus states for accessibility
   - Responsive breakpoints (sm, md, lg, xl)
   - Color palette:
     * Primary: blue-600
     * Success: green-600
     * Warning: orange-600
     * Danger: red-600
     * Gray scale for backgrounds

10. Accessibility:
    - Proper semantic HTML
    - ARIA labels for icon buttons
    - Keyboard navigation support
    - Focus visible styles
    - Alt text for images/icons

TESTING CHECKLIST:
- [ ] Dashboard loads and displays tasks
- [ ] Can open create task modal
- [ ] Can create new task with required fields
- [ ] Form validation works
- [ ] New task appears in list immediately
- [ ] Can edit existing task
- [ ] Changes are reflected in list
- [ ] Can delete task after confirmation
- [ ] Task is removed from list
- [ ] Can cancel delete without removing task
- [ ] Can filter by status
- [ ] Can filter by priority
- [ ] Can combine filters
- [ ] Can clear filters
- [ ] Empty state shows when no tasks
- [ ] Status badges show correct colors
- [ ] Priority badges show correct colors
- [ ] Overdue tasks are highlighted
- [ ] Mobile responsive layout works
- [ ] Can navigate between Dashboard and Analytics
- [ ] Can logout successfully
- [ ] Loading states work properly
- [ ] Toast notifications appear and dismiss

DELIVERABLE: Full-featured task management interface with create, read, update, delete, and filtering capabilities.
```

---

## Phase 7: Analytics Dashboard

**Objective**: Create visual analytics dashboard with statistics and charts.

```
PHASE 7: Build analytics dashboard with comprehensive statistics and visualizations.

TASKS:

1. Install Chart.js:
   - Run: npm install chart.js vue-chartjs
   - Chart.js: charting library
   - vue-chartjs: Vue 3 wrapper for Chart.js

2. Create Analytics Service (/services/analyticsService.js):
   - Import api from api.js
   
   - async getDashboardStats():
     * GET /analytics/dashboard
     * Return analytics data object
     * Handle errors

3. Create Analytics Store (/stores/analytics.js):
   - State:
     * stats: null
     * loading: false
     * error: null
   
   - Actions:
     * async fetchStats():
       - Set loading true
       - Call analyticsService.getDashboardStats()
       - Update stats state
       - Set loading false
       - Handle errors
     
     * refreshStats():
       - Alias for fetchStats (for manual refresh)
   
   - Getters:
     * hasStats: return !!state.stats
     * totalTasks: return stats.totalTasks or 0
     * completionRate: return stats.completionRate or 0

4. Create Chart Components:
   
   - BaseChart.vue:
     * Props: chartData, chartType, options
     * Wrapper component for vue-chartjs
     * Support for different chart types
     * Responsive container
     * Loading state
   
   - StatusChart.vue:
     * Props: data (byStatus object)
     * Use Doughnut chart from vue-chartjs
     * Display tasks by status distribution
     * Colors matching status badges:
       - Pending: yellow
       - In Progress: blue
       - Completed: green
     * Legend positioning
     * Responsive
     * Tooltips enabled
   
   - PriorityChart.vue:
     * Props: data (byPriority object)
     * Use Bar chart from vue-chartjs
     * Display tasks by priority
     * Colors matching priority badges:
       - Low: green
       - Medium: orange
       - High: red
     * Y-axis: count
     * X-axis: priority levels
     * Responsive
     * Tooltips enabled
   
   - TrendChart.vue (Optional):
     * Props: data (trend over time)
     * Use Line chart
     * Show task completion trend
     * Date on X-axis
     * Count on Y-axis

5. Create Stat Card Components:
   
   - StatCard.vue:
     * Props: title, value, icon, color, subtitle
     * Display single statistic in card format
     * Large number display
     * Icon (optional)
     * Subtitle for context
     * Color accent (top border or background)
     * Responsive
     * Shadow and hover effects
   
   - StatCardGrid.vue:
     * Slot-based component
     * Responsive grid layout
     * 1 col mobile, 2 col tablet, 3-4 col desktop

6. Create AnalyticsView.vue:
   - Template structure:
     * Header section:
       - Page title "Analytics Dashboard"
       - Refresh button (with icon)
       - Last updated timestamp
     
     * Stats Grid:
       - StatCard for Total Tasks
       - StatCard for Pending Tasks (yellow)
       - StatCard for In Progress Tasks (blue)
       - StatCard for Completed Tasks (green)
       - StatCard for Overdue Tasks (red)
       - StatCard for Completion Rate (percentage)
       - StatCard for Completed This Week
     
     * Charts Section:
       - Two-column layout (responsive):
         * Left: StatusChart (task status distribution)
         * Right: PriorityChart (task priority distribution)
       - Chart cards with titles
     
     * Additional Insights Section (optional):
       - List of insights or tips based on data
       - Example: "You have X overdue tasks"
       - Example: "Great job! Y% completion rate"
   
   - Script logic:
     * Import analytics store
     * Reactive state:
       - lastRefreshed: null
     
     * On mounted:
       - Fetch stats from store
       - Set lastRefreshed timestamp

     * Methods:
       - async refreshStats():
         * Call analyticsStore.fetchStats()
         * Update lastRefreshed
         * Show success toast
       
     * Computed:
       - stats: from analyticsStore
       - loading: from analyticsStore
       - totalTasks: stats?.totalTasks || 0
       - completionRate: stats?.completionRate || 0
   
   - Styling:
     * Full page layout
     * Proper spacing
     * Responsive grid
     * Chart containers with proper sizing

7. Update Router:
   - Route already added in Phase 5
   - Ensure /analytics points to AnalyticsView

8. Update Navigation:
   - Link already added in AppHeader (Phase 6)
   - Ensure active state for /analytics route

DELIVERABLE: Visual analytics dashboard with statistics and charts.
```

---

## Phase 8: Final Polish, Documentation & Testing

**Objective**: Add final touches, comprehensive documentation, and ensure all tests pass.

```
PHASE 8: Final polish, complete documentation, and comprehensive testing.

TASKS:

1. Backend Enhancements:
   
   - Add Request Logging (/src/middleware/logger.ts):
     * Log incoming requests (method, URL, IP)
     * Log response time
     * Log errors with stack traces (development only)
     * Use morgan or custom logger
   
   - Add Rate Limiting (/src/middleware/rateLimit.ts):
     * Implement express-rate-limit
     * Configure limits:
       - Auth endpoints: 5 requests per 15 minutes
       - General API: 100 requests per 15 minutes
     * Return 429 Too Many Requests
   
   - Add Input Sanitization:
     * Install express-mongo-sanitize or similar
     * Sanitize all user inputs
     * Prevent SQL injection (Drizzle handles this)
   
   - Improve Error Messages:
     * User-friendly error messages
     * Don't expose internal details in production
     * Consistent error format
   
   - Add Health Check Endpoint:
     * GET /api/health
     * Check database connection
     * Return { status: 'ok', timestamp, database: 'connected' }

2. Frontend Enhancements:
   
   - Add Loading States:
     * Skeleton loaders for task cards
     * Loading spinners for async operations
     * Progress bars for long operations
   
   - Add Success/Error Toast Notifications:
     * Already implemented in Phase 6
     * Ensure all CRUD operations show toasts
   
   - Add Confirmation Dialogs:
     * Already implemented for delete
     * Add for logout if desired
   
   - Improve Form Validation:
     * Real-time validation feedback
     * Show validation errors as user types
     * Clear validation errors on input
   
   - Add Empty States:
     * Already implemented
     * Add illustrations or icons
     * Make them friendly and actionable
   
   - Mobile Responsive Testing:
     * Test on mobile devices
     * Ensure hamburger menu works
     * Test touch interactions
     * Ensure modals work on mobile
   
   - Add Keyboard Shortcuts (optional):
     * Ctrl+K: create new task
     * Escape: close modals
     * Enter: submit forms
   
   - Add Accessibility Improvements:
     * ARIA labels on all interactive elements
     * Keyboard navigation support
     * Focus indicators
     * Screen reader support
     * Color contrast compliance

3. Environment Configuration:
   
   - Backend .env.example:
     * Document all required variables
     * Provide example values
     * Add comments for clarity
   
   - Frontend .env.example:
     * Document VITE_API_URL
     * Add any other env variables
   
   - Update .gitignore:
     * node_modules/
     * .env (all .env.* except .example)
     * dist/
     * build/
     * coverage/
     * .DS_Store
     * *.log

4. Create Root README.md:
   
   Content structure:
   
   # Task Management Application
   
   ## 📋 Overview
   A full-stack task management application built with Vue.js, Node.js, Express, and MySQL.
   
   ## ✨ Features
   - User authentication with session management
   - Create, read, update, and delete tasks
   - Filter tasks by status and priority
   - Analytics dashboard with statistics and charts
   - Responsive design for mobile and desktop
   - Secure session-based authentication
   
   ## 🛠 Tech Stack
   ### Frontend
   - Vue.js 3 (Composition API)
   - TypeScript
   - Vite
   - Pinia (state management)
   - Vue Router
   - Axios
   - Tailwind CSS
   - Chart.js
   - Vitest (testing)
   
   ### Backend
   - Node.js
   - Express
   - TypeScript
   - Drizzle ORM
   - MySQL
   - Express Session
   - Bcrypt.js
   - Vitest & Supertest (testing)
   
   ## 📦 Project Structure
   ```
   task-management-app/
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
   
   ## 🚀 Prerequisites
   - Node.js (v18 or higher)
   - MySQL (v8 or higher)
   - npm or yarn
   
   ## ⚙️ Installation & Setup
   
   ### 1. Clone the repository
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```
   
   ### 2. Install dependencies
   ```bash
   npm run install:all
   ```
   
   ### 3. Set up MySQL database
   ```sql
   CREATE DATABASE task_management;
   ```
   
   ### 4. Configure environment variables
   
   Backend (.env in apps/backend):
   ```env
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
   
   Frontend (.env in apps/frontend):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   
   ### 5. Run database migrations
   ```bash
   npm run migrate
   ```
   
   ### 6. (Optional) Seed database with test data
   ```bash
   npm run seed
   ```
   
   ### 7. Start the application
   ```bash
   npm run dev
   ```
   
   This starts both backend (port 5000) and frontend (port 5173).
   
   Or start them separately:
   ```bash
   npm run dev:backend    # Start backend only
   npm run dev:frontend   # Start frontend only
   ```
   
   ### 8. Access the application
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api
   
   ## 👥 Default Test Users
   If you ran the seed script, you can log in with these accounts:
   - Email: demo@example.com | Password: Demo123!
   - Email: test@example.com | Password: Test123!
   - Email: admin@example.com | Password: Admin123!
   
   ## 📡 API Endpoints
   
   ### Authentication
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login user
   - POST `/api/auth/logout` - Logout user
   - GET `/api/auth/me` - Get current user
   
   ### Tasks
   - GET `/api/tasks` - Get all tasks (with optional filters)
   - GET `/api/tasks/:id` - Get single task
   - POST `/api/tasks` - Create new task
   - PUT `/api/tasks/:id` - Update task
   - DELETE `/api/tasks/:id` - Delete task
   
   ### Analytics
   - GET `/api/analytics/dashboard` - Get dashboard statistics
   
   ### Health
   - GET `/api/health` - Health check
   
   ## 🧪 Running Tests
   
   ### Backend tests
   ```bash
   cd apps/backend
   npm test                # Run all tests
   npm run test:watch      # Run tests in watch mode
   npm run test:coverage   # Run tests with coverage
   ```
   
   ### Frontend tests
   ```bash
   cd apps/frontend
   npm test                # Run all tests
   npm run test:watch      # Run tests in watch mode
   npm run test:ui         # Run tests with UI
   ```
   
   ### Run all tests (from root)
   ```bash
   npm test
   ```
   
   ## 📚 Database Schema
   
   ### Users Table
   - id (INT, PRIMARY KEY)
   - email (VARCHAR, UNIQUE)
   - password (VARCHAR, hashed)
   - createdAt (TIMESTAMP)
   - updatedAt (TIMESTAMP)
   
   ### Tasks Table
   - id (INT, PRIMARY KEY)
   - userId (INT, FOREIGN KEY)
   - title (VARCHAR)
   - description (TEXT)
   - status (ENUM: Pending, In Progress, Completed)
   - priority (ENUM: Low, Medium, High)
   - dueDate (DATE)
   - createdAt (TIMESTAMP)
   - updatedAt (TIMESTAMP)
   
   ### Sessions Table
   - session_id (VARCHAR, PRIMARY KEY)
   - expires (INT)
   - data (TEXT)
   
   ## 🔒 Security Features
   - Password hashing with bcrypt
   - Session-based authentication
   - HTTP-only cookies
   - CORS protection
   - Input validation and sanitization
   - SQL injection prevention (via Drizzle ORM)
   - Rate limiting on API endpoints
   
   ## 🎨 Features in Detail
   
   ### Task Management
   - Create tasks with title, description, status, priority, and due date
   - Edit existing tasks
   - Delete tasks with confirmation
   - Filter tasks by status and priority
   - View overdue tasks
   - Responsive card-based layout
   
   ### Analytics Dashboard
   - Total tasks count
   - Tasks by status (Pending, In Progress, Completed)
   - Tasks by priority (Low, Medium, High)
   - Overdue tasks count
   - Completed this week
   - Completion rate percentage
   - Visual charts (pie/doughnut and bar charts)
   
   ### User Experience
   - Responsive design (mobile, tablet, desktop)
   - Loading states and skeletons
   - Toast notifications for feedback
   - Confirmation dialogs for destructive actions
   - Empty states with friendly messages
   - Keyboard navigation support
   
   ## 🚧 Future Enhancements
   - Task categories/tags
   - Task sharing and collaboration
   - Subtasks and task dependencies
   - File attachments
   - Task comments
   - Email notifications
   - Calendar view
   - Drag-and-drop task reordering
   - Dark mode
   - Export tasks (PDF, CSV)
   
   ## 📝 License
   MIT
   
   ## 👨‍💻 Author
   [Your Name]
   
   ## 🤝 Contributing
   Contributions, issues, and feature requests are welcome!

5. Create Backend README.md (/apps/backend/README.md):
   
   # Backend API
   
   ## Overview
   Express.js REST API with Drizzle ORM and MySQL
   
   ## Setup
   See root README for complete setup instructions
   
   ## API Documentation
   [Link to detailed API docs or add Swagger]
   
   ## Project Structure
   ```
   src/
   ├── config/          # Configuration files
   ├── controllers/     # Route controllers
   ├── db/              # Database schema and migrations
   ├── middleware/      # Express middleware
   ├── routes/          # API routes
   ├── types/           # TypeScript types
   ├── tests/           # Unit and integration tests
   ├── utils/           # Utility functions
   └── server.ts        # Entry point
   ```
   
   ## Environment Variables
   [List all env variables with descriptions]
   
   ## Database Migrations
   ```bash
   npm run db:generate  # Generate new migration
   npm run migrate      # Run migrations
   npm run seed         # Seed database
   npm run db:studio    # Open Drizzle Studio
   ```
   
   ## Testing
   ```bash
   npm test             # Run all tests
   npm run test:watch   # Watch mode
   npm run test:coverage # With coverage
   ```

6. Create Frontend README.md (/apps/frontend/README.md):
   
   # Frontend Application
   
   ## Overview
   Vue.js 3 application with Composition API and TypeScript
   
   ## Setup
   See root README for complete setup instructions
   
   ## Project Structure
   ```
   src/
   ├── components/      # Reusable components
   │   ├── common/      # Common UI components
   │   ├── tasks/       # Task-specific components
   │   └── layout/      # Layout components
   ├── views/           # Page components
   ├── stores/          # Pinia stores
   ├── services/        # API services
   ├── router/          # Vue Router config
   ├── types/           # TypeScript types
   ├── composables/     # Vue composables
   ├── utils/           # Utility functions
   └── tests/           # Component and unit tests
   ```
   
   ## Available Scripts
   ```bash
   npm run dev          # Start dev server
   npm run build        # Build for production
   npm run preview      # Preview production build
   npm test             # Run tests
   npm run lint         # Lint code
   ```
   
   ## Components
   [Document key components]
   
   ## State Management
   [Explain Pinia stores]
   
   ## Testing
   ```bash
   npm test             # Run all tests
   npm run test:ui      # UI mode
   ```

7. Code Quality & Cleanup:
   
   - Remove console.logs:
     * Search and remove unnecessary console statements
     * Keep intentional logs in development
   
   - Consistent Code Formatting:
     * Use Prettier or ESLint
     * Format all files
     * Consistent naming conventions
   
   - Add Code Comments:
     * Document complex logic
     * Add JSDoc comments for functions
     * Explain non-obvious code
   
   - TypeScript Strict Mode:
     * Ensure no 'any' types
     * Fix all TypeScript errors
     * Add proper type definitions

8. Testing Checklist:
   
   ✓ BACKEND TESTS:
   - [ ] All unit tests pass
   - [ ] All integration tests pass
   - [ ] Auth endpoints work correctly
   - [ ] Task CRUD endpoints work
   - [ ] Analytics endpoint works
   - [ ] Authorization is enforced
   - [ ] Validation catches errors
   - [ ] Error handling works
   - [ ] Sessions persist correctly
   
   ✓ FRONTEND TESTS:
   - [ ] All component tests pass
   - [ ] Store tests pass
   - [ ] Login flow works
   - [ ] Register flow works
   - [ ] Task CRUD operations work
   - [ ] Filtering works
   - [ ] Analytics displays correctly
   - [ ] Routing works
   - [ ] Session management works
   
   ✓ MANUAL TESTING:
   - [ ] User registration works
   - [ ] User login/logout works
   - [ ] Create task works
   - [ ] Edit task works
   - [ ] Delete task works
   - [ ] Task filters work
   - [ ] Analytics displays correctly
   - [ ] Mobile responsive
   - [ ] No console errors
   - [ ] Loading states work
   - [ ] Error messages display
   - [ ] Toast notifications work
   - [ ] Session persists on refresh
   - [ ] Logout clears session
   
   ✓ SECURITY TESTING:
   - [ ] Passwords are hashed
   - [ ] Sessions are secure
   - [ ] CORS is configured
   - [ ] Input validation works
   - [ ] Authorization enforced
   - [ ] No SQL injection possible
   - [ ] Rate limiting works
   
   ✓ PERFORMANCE:
   - [ ] API responses are fast (<200ms)
   - [ ] Frontend loads quickly
   - [ ] No memory leaks
   - [ ] Database queries optimized
   
   ✓ BROWSER TESTING:
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Edge

9. Final Checklist:
   
   - [ ] All tests passing
   - [ ] Documentation complete
   - [ ] README files created
   - [ ] .env.example files created
   - [ ] .gitignore configured
   - [ ] No sensitive data in repo
   - [ ] Code is formatted
   - [ ] TypeScript has no errors
   - [ ] Application runs without errors
   - [ ] Mobile responsive
   - [ ] Accessibility features work
   - [ ] Performance is acceptable
   - [ ] Security measures in place

DELIVERABLE: Production-ready application with complete documentation, comprehensive tests, and polished user experience.
```

---

## 🎯 Quick Start Summary

After completing all phases, here's how to use the application:

### For Development:
1. Clone repository
2. Run `npm run install:all`
3. Set up MySQL database
4. Configure .env files (backend and frontend)
5. Run `npm run migrate`
6. (Optional) Run `npm run seed` for test data
7. Run `npm run dev` to start both servers
8. Access at http://localhost:5173

### For Testing:
- Backend tests: `cd apps/backend && npm test`
- Frontend tests: `cd apps/frontend && npm test`
- All tests: `npm test` from root

### Default Test Credentials:
- demo@example.com / Demo123!
- test@example.com / Test123!
- admin@example.com / Admin123!

---

## 📋 Phase Completion Order

Follow phases in order for best results:
1. ✅ Phase 1: Monorepo & Database Setup
2. ✅ Phase 2: Authentication System
3. ✅ Phase 3: Task Management Backend
4. ✅ Phase 4: Analytics Endpoint
5. ✅ Phase 5: Frontend Setup & Auth UI
6. ✅ Phase 6: Task Management UI
7. ✅ Phase 7: Analytics Dashboard
8. ✅ Phase 8: Polish & Documentation

Each phase builds on the previous one. Complete all tasks in a phase before moving to the next.

---

## 🛠 Troubleshooting

### Common Issues:

**Database Connection Error:**
- Check MySQL is running
- Verify .env credentials
- Ensure database exists

**Session Not Persisting:**
- Check withCredentials: true in axios
- Verify CORS credentials setting
- Check session cookie in browser

**Tests Failing:**
- Ensure test database is set up
- Check all dependencies installed
- Clear test data between runs

**Frontend Not Connecting to Backend:**
- Verify VITE_API_URL is correct
- Check backend server is running
- Check CORS configuration

---

## 💡 Tips for Success

1. **Complete phases sequentially** - Don't skip ahead
2. **Test after each phase** - Ensure everything works before continuing
3. **Read error messages carefully** - They usually point to the issue
4. **Use Drizzle Studio** - Visual database management is helpful
5. **Check browser DevTools** - Network tab shows API calls
6. **Use TypeScript** - Catch errors early with type checking
7. **Write tests as you go** - Don't leave testing for the end
8. **Commit frequently** - Save progress after completing each phase
9. **Keep code organized** - Follow the provided structure
10. **Ask for help** - Use the test users and seed data for debugging

---

## 🎓 Learning Outcomes

By completing this project, you will learn:
- Full-stack TypeScript development
- RESTful API design
- Session-based authentication
- Vue.js Composition API
- State management with Pinia
- ORM usage (Drizzle)
- Database migrations
- Testing strategies
- Monorepo structure
- Security best practices
- Responsive design
- Error handling
- Form validation
- Real-time updates
- Analytics and data visualization

