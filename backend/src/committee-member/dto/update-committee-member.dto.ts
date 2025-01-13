import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCommitteeMemberDto } from './create-committee-member.dto';

export class UpdateCommitteeMemberDto extends PartialType(
  OmitType(CreateCommitteeMemberDto, ['eventEditionId', 'userId'] as const),
) {}
