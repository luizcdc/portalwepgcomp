import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  submissionId: string;

  @IsUUID()
  evaluationCriteriaId: string;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  comments?: string;
}
