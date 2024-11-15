import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
  IsISO8601,
} from 'class-validator';

export class CreateEventEditionDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  description: string;

  @IsString()
  callForPapersText: string;

  @IsString()
  partnersText: string;

  @IsString()
  @IsUrl()
  @MaxLength(255)
  url: string;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsISO8601()
  submissionDeadline: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isEvaluationRestrictToLoggedUsers?: boolean;

  @IsInt()
  presentationDuration: number;

  @IsInt()
  presentationsPerPresentationBlock: number;
}
