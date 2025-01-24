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
import { EvaluationModule } from './evaluation/evaluation.module';
import { S3UtilsModule } from './s3-utils/s3-utils.module';
import { RoomModule } from './room/room.module';
import { GuidanceModule } from './guidance/guidance.module';
import { AwardedPanelistsModule } from './awarded-panelists/awarded-panelists.module';
import { AwardedDoctoralStudentsModule } from './awarded-doctoral-students/awarded-doctoral-students.module';
import { EvaluationCriteriaModule } from './evaluation-criteria/evaluation-criteria.module';
import { CertificateModule } from './certificate/certificate.module';
import { ScoringModule } from './scoring/scoring.module';

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
    EvaluationModule,
    S3UtilsModule,
    RoomModule,
    GuidanceModule,
    AwardedPanelistsModule,
    AwardedDoctoralStudentsModule,
    EvaluationCriteriaModule,
    CertificateModule,
    ScoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
