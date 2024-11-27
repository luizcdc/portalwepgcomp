import { Module } from '@nestjs/common';
import { PresentationService } from './presentation.service';
import { PresentationController } from './presentation.controller';
import { SubmissionModule } from '../submission/submission.module';

@Module({
  controllers: [PresentationController],
  providers: [PresentationService],
  imports: [SubmissionModule],
})
export class PresentationModule {}
