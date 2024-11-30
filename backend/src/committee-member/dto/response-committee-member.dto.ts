import { CommitteeLevel, CommitteeRole } from '@prisma/client';

import { Expose } from 'class-transformer';

export class ResponseCommitteeMemberDto {
  @Expose()
  id: string;

  @Expose()
  eventEditionId: string;

  @Expose()
  userId: string;

  @Expose()
  level: CommitteeLevel;

  @Expose()
  role: CommitteeRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<ResponseCommitteeMemberDto>) {
    Object.assign(this, partial);
  }
}
