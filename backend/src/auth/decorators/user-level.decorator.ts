import { SetMetadata } from '@nestjs/common';
import { UserLevel } from '@prisma/client';

export const UserLevels = (...levels: UserLevel[]) =>
  SetMetadata('levels', levels);

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
