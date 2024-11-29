import { Module } from '@nestjs/common';
import { CommitteeMemberService } from './committee-member.service';
import { CommitteeMemberController } from './committee-member.controller';

@Module({
  controllers: [CommitteeMemberController],
  providers: [CommitteeMemberService],
})
export class CommitteeMemberModule {}
