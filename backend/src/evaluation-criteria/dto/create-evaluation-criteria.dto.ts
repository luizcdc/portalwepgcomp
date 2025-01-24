import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEvaluationCriteriaDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  weightRadio?: number;

  @IsUUID()
  eventEditionId: string;
}
