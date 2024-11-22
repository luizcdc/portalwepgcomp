import { SetMetadata } from '@nestjs/common';
import { UserLevel } from '@prisma/client';

export const UserLevels = (...levels: UserLevel[]) =>
  SetMetadata('levels', levels);
