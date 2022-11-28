import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../interfaces/valid-roles';

export const ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
  return SetMetadata(ROLES, args);
};
