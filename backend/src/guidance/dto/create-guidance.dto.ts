import { IsString, IsOptional } from 'class-validator';

export class CreateGuidanceDto {
  @IsOptional()
  @IsString()
  summary: string;

  @IsOptional()
  @IsString()
  authorGuidance: string;

  @IsOptional()
  @IsString()
  reviewerGuidance: string;

  @IsOptional()
  @IsString()
  audienceGuidance: string;

  @IsString()
  @IsOptional()
  eventEditionId: string;
}
