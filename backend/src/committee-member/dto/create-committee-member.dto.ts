import { IsUUID, IsEnum } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { CommitteeLevel, CommitteeRole } from '@prisma/client';

export class CreateCommitteeMemberDto {
  @ApiProperty({
    description: 'The ID of the event edition',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  eventEditionId: string;

  @ApiProperty({
    description: 'The ID of the user',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'The authority level of the committee member',
    enum: CommitteeLevel,
  })
  @IsEnum(CommitteeLevel)
  level: CommitteeLevel;

  @ApiProperty({
    description: 'The role of the committee member',
    enum: CommitteeRole,
  })
  @IsEnum(CommitteeRole)
  role: CommitteeRole;
}
