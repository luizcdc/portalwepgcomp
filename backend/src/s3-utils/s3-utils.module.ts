import { Module } from '@nestjs/common';
import { S3UtilsService } from './s3-utils.service';
import { S3UtilsController } from './s3-utils.controller';

@Module({
  controllers: [S3UtilsController],
  providers: [S3UtilsService],
})
export class S3UtilsModule {}
