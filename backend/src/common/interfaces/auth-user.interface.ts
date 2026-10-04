export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface AuthUser {
  sub: string;
  email: string;
  role: UserRole;
}
