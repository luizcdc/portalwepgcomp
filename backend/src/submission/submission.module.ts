import { Module } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { SubmissionController } from './submission.controller';

@Module({
  controllers: [SubmissionController],
  providers: [SubmissionService],
})
export class SubmissionModule {}
