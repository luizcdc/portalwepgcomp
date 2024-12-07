import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async registerEvaluation(
    @Body()
    body: {
      userId: string;
      presentationId: string;
      score: number;
      comments?: string;
    },
  ) {
    return this.evaluationService.registerEvaluation(
      body.userId,
      body.presentationId,
      body.score,
      body.comments,
    );
  }
}