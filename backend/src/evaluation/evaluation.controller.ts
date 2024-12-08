import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
// import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('evaluations')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  async create(@Body() evaluations: CreateEvaluationDto[]) {
    return await this.evaluationService.create(evaluations);
  }

  /*
  @Patch(':id')
  async updateEvaluation(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    return await this.evaluationService.updateEvaluation(id, updateEvaluationDto);
  }
*/

  @Get()
  async find(@Query('userId') userId?: string) {
    if (userId) {
      return await this.evaluationService.findOne(userId);
    }
    return await this.evaluationService.findAll();
  }

  @Get('submission/:submissionId/final-grade')
  async calculateFinalGrade(@Param('submissionId') submissionId: string) {
    return await this.evaluationService.calculateFinalGrade(submissionId);
  }
}
