import { Module } from '@nestjs/common';
import { EvaluationService as EvaluationService } from './evaluation.service';

@Module({
  providers: [EvaluationService],
})
export class EvaluationModule {}
