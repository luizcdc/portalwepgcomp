import { Controller, Post, Body } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationsDto } from './dto/create-evaluation.dto';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async registerEvaluation(
    @Body()
    createEvaluationsDto: CreateEvaluationsDto
    
  ) {
    
    return await this.evaluationService.registerEvaluation(createEvaluationsDto);
  }
}