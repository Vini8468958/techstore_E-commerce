import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../interfaces/auth-user.interface.js';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
