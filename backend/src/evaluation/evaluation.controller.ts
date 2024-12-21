import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('evaluations')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create new evaluations.',
  })
  @ApiBody({
    type: [CreateEvaluationDto],
    description:
      'Array of evaluations (one for each criteria), all for the same submissionId.',
  })
  @ApiResponse({
    status: 201,
    description: 'The evaluations have been created successfully.',
  })
  async create(@Body() evaluations: CreateEvaluationDto[]) {
    return await this.evaluationService.create(evaluations);
  }

  @Get()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find evaluations' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter evaluations by user ID',
  })
  @ApiResponse({ status: 200, description: 'Return evaluations.' })
  async find(@Query('userId') userId?: string) {
    if (userId) {
      return await this.evaluationService.findOne(userId);
    }
    return await this.evaluationService.findAll();
  }

  @Get('submission/:submissionId/final-grade')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  @ApiBearerAuth()
  async calculateFinalGrade(@Param('submissionId') submissionId: string) {
    return await this.evaluationService.calculateFinalGrade(submissionId);
  }
}
