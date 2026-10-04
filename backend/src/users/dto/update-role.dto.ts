import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { UserRole } from '../../common/interfaces/auth-user.interface.js';

export class UpdateRoleDto {
  @ApiProperty({ enum: ['CUSTOMER', 'ADMIN'] })
  @IsIn(['CUSTOMER', 'ADMIN'])
  role!: UserRole;
}
