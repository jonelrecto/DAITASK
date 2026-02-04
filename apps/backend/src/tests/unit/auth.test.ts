import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';

describe('Auth unit tests', () => {
  describe('password hashing', () => {
    it('hashes password correctly', async () => {
      const password = 'Test123!';
      const hash = await bcrypt.hash(password, 10);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(20);
    });

    it('produces different hashes for same password', async () => {
      const password = 'Test123!';
      const hash1 = await bcrypt.hash(password, 10);
      const hash2 = await bcrypt.hash(password, 10);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('password comparison', () => {
    it('returns true for correct password', async () => {
      const password = 'Demo123!';
      const hash = await bcrypt.hash(password, 10);
      const result = await bcrypt.compare(password, hash);
      expect(result).toBe(true);
    });

    it('returns false for wrong password', async () => {
      const password = 'Demo123!';
      const hash = await bcrypt.hash(password, 10);
      const result = await bcrypt.compare('WrongPassword', hash);
      expect(result).toBe(false);
    });
  });
});
