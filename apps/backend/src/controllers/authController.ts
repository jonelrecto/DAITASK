import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema/users.schema';

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }
    throw err;
  }
  res.status(201).json({ message: 'User created successfully' });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  await new Promise<void>((resolve, reject) => {
    req.session!.userId = user.id;
    req.session!.save((err) => (err ? reject(err) : resolve()));
  });
  res.status(200).json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session?.destroy((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  res.clearCookie('connect.sid');
  res.status(200).json({ message: 'Logged out successfully' });
}

export function getCurrentUser(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }
  res.status(200).json({ user: req.user });
}
