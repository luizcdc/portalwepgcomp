import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  IsUrl,
  MaxLength,
  IsISO8601,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateEventEditionDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  callForPapersText?: string;

  @IsString()
  @IsOptional()
  partnersText?: string;

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
  isEvaluationRestrictToLoggedUsers?: boolean;

  @IsInt()
  @Min(1)
  presentationDuration: number;

  @IsInt()
  @Min(1)
  presentationsPerPresentationBlock: number;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;
}
