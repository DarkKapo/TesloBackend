import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { validRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';

export function Auth(...roles: validRoles[]) {
  return applyDecorators(
    RoleProtected( ...roles ),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
