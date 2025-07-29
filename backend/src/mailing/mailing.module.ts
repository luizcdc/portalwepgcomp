import { Module } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailingController } from './mailing.controller';
import { EventEditionModule } from 'src/event-edition/event-edition.module';
import { CommitteeMemberModule } from 'src/committee-member/committee-member.module';

@Module({
  imports: [EventEditionModule, CommitteeMemberModule],
  controllers: [MailingController],
  providers: [MailingService],
  exports: [MailingService],
})
export class MailingModule {}
