import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
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
  @MaxLength(255)
  location: string;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsISO8601()
  @IsOptional()
  submissionStartDate?: Date;

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

  @IsString()
  @IsOptional()
  roomName?: string;
}

export class CreateFromEventEditionFormDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  description: string;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsString()
  @MaxLength(255)
  location: string;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;

  @IsOptional()
  organizingCommitteeIds: Array<string>;

  @IsOptional()
  itSupportIds: Array<string>;

  @IsOptional()
  administrativeSupportIds: Array<string>;

  @IsOptional()
  communicationIds: Array<string>;

  @IsInt()
  @Min(1)
  presentationsPerPresentationBlock: number;

  @IsInt()
  @Min(1)
  presentationDuration: number;

  @IsString()
  @IsOptional()
  callForPapersText?: string;

  @IsISO8601()
  submissionDeadline: Date;

  @IsString()
  @IsOptional()
  roomName?: string;
}
