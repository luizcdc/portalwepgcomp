import { IsArray, ArrayNotEmpty, ValidateNested, IsUUID, IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

// Sub-DTO para representar cada nota com seu critério
class GradeDto {
  @IsUUID()
  @IsNotEmpty()
  evaluationCriteriaId: string;

  @IsNumber()
  score: number;
}

export class CreateEvaluationsDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  submissionId: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => GradeDto) // Necessário para validar corretamente os objetos do array
  grades: GradeDto[];
}