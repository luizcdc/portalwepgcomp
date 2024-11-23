import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EventEditionModule } from './event-edition/event-edition.module';
import { MailingModule } from './mailing/mailing.module';
import { QueueModule } from './queue/queue.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PresentationModule } from './presentation/presentation.module';
import { SubmissionModule } from './submission/submission.module';
import { PresentationBlockModule } from './presentation-block/presentation-block.module';
import { CommitteeMemberModule } from './committee-member/committee-member.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot(),
    EventEditionModule,
    MailingModule,
    QueueModule,
    ScheduleModule.forRoot(),
    PresentationModule,
    SubmissionModule,
    PresentationBlockModule,
    CommitteeMemberModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
