import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../server';
import { getTestPool, runMigrations, closePool } from '../utils/testDb';
import { createTestUser, clearTestData } from '../utils/testHelpers';
import { db } from '../../db';
import { users } from '../../db/schema/users.schema';
import { eq } from 'drizzle-orm';

describe('Auth integration tests', () => {
  beforeAll(async () => {
    const pool = await getTestPool();
    await runMigrations(pool);
    await closePool(pool);
  });

  afterAll(async () => {
    await clearTestData();
  });

  beforeEach(async () => {
    await db.delete(users);
  });

  describe('POST /api/auth/register', () => {
    it('can register with valid data', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: 'Password123!' });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });

    it('cannot register with duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'Password123!' });
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'Other456!' });
      expect(res.status).toBe(400);
    });

    it('cannot register with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'Password123!' });
      expect(res.status).toBe(400);
    });

    it('cannot register with short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'short@example.com', password: '12345' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('can login with correct credentials', async () => {
      const { user, plainPassword } = await createTestUser('login@example.com', 'Login123!');
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: plainPassword });
      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.id).toBe(user.id);
      expect(res.body.user.password).toBeUndefined();
    });

    it('cannot login with wrong password', async () => {
      const { user } = await createTestUser('wrongpw@example.com', 'Right123!');
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: 'WrongPassword' });
      expect(res.status).toBe(401);
    });

    it('cannot login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'Any123!' });
      expect(res.status).toBe(401);
    });

    it('sets session cookie after login', async () => {
      const { user, plainPassword } = await createTestUser('cookie@example.com', 'Cookie123!');
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: plainPassword });
      expect(res.status).toBe(200);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some((c: string) => c.includes('connect.sid'))).toBe(true);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user when authenticated', async () => {
      const { user, plainPassword } = await createTestUser('me@example.com', 'Me123!');
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ email: user.email, password: plainPassword });
      const res = await agent.get('/api/auth/me');
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.password).toBeUndefined();
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('can logout when authenticated', async () => {
      const { user, plainPassword } = await createTestUser('logout@example.com', 'Logout123!');
      const agent = request.agent(app);
      await agent.post('/api/auth/login').send({ email: user.email, password: plainPassword });
      const res = await agent.post('/api/auth/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
      const meRes = await agent.get('/api/auth/me');
      expect(meRes.status).toBe(401);
    });

    it('returns 401 when not authenticated', async () => {
      const res = await request(app).post('/api/auth/logout');
      expect(res.status).toBe(401);
    });
  });
});
