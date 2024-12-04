import { IsString, IsDate } from 'class-validator';

export class CreateGuidanceDto {
  @IsString()
  summary: string;

  @IsString()
  authorGuidance: string;

  @IsString()
  reviewerGuidance: string;

  @IsString()
  audienceGuidance: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
