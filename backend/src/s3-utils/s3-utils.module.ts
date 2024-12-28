import { Module } from '@nestjs/common';
import { S3UtilsService } from './s3-utils.service';
import { S3UtilsController } from './s3-utils.controller';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: parseInt(
              configService.getOrThrow('UPLOAD_RATE_LIMIT_TTL'), // Time window in milliseconds ~ 5 minutes on enviroment variables
              10,
            ),
            limit: parseInt(
              configService.getOrThrow('UPLOAD_RATE_LIMIT_LIMIT'), // Requests limit ~ based on TTL
              10,
            ),
            blockDuration: parseInt(
              configService.getOrThrow('UPLOAD_RATE_LIMIT_BLOCKDURATION'), // Blocking time per user ~ after "Many Request" error
              10,
            ),
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [S3UtilsController],
  providers: [
    S3UtilsService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class S3UtilsModule {}
