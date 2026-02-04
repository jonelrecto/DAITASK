import type { User as SchemaUser } from '../db/schema/users.schema';

export type User = Omit<SchemaUser, 'password'>;
export type UserWithoutPassword = User;

export interface CreateUserDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
