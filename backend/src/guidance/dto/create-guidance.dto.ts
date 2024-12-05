import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateGuidanceDto {
  @IsString()
  summary: string;

  @IsString()
  @IsOptional()
  authorGuidance: string;

  @IsString()
  @IsOptional()
  reviewerGuidance: string;

  @IsString()
  @IsOptional()
  audienceGuidance: string;

  @IsString()
  @IsOptional()
  eventEditionId: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
