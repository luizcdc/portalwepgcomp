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
import { ThrottlerModule } from '@nestjs/throttler';
import { RedisThrottlerStorageService } from './redis/redis-throttler-storage.service';
import { RedisModule } from './redis/redis.module';

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
    RedisModule,
    ThrottlerModule.forRootAsync({
      imports: [RedisModule],
      inject: [RedisThrottlerStorageService],
      useFactory: async (redisStorage: RedisThrottlerStorageService) => ({
        ttl: 60, // Janela de tempo em segundos
        limit: 5, // Limite de requisições
        storage: redisStorage,
        throttlers: [],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
