import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEvaluationDto {
  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  comments?: string;
}
