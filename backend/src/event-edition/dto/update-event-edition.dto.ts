import { PartialType } from '@nestjs/mapped-types';
import { CreateEventEditionDto } from './create-event-edition.dto';
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateEventEditionDto extends PartialType(CreateEventEditionDto) {}

export class UpdateFromEventEditionFormDto {
  @IsString()
  @MaxLength(255)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsISO8601()
  @IsOptional()
  startDate?: Date;

  @IsISO8601()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  location?: string;

  @IsUUID()
  @IsOptional()
  coordinatorId?: string;

  @IsOptional()
  organizingCommitteeIds?: Array<string>;

  @IsOptional()
  itSupportIds?: Array<string>;

  @IsOptional()
  administrativeSupportIds?: Array<string>;

  @IsOptional()
  communicationIds?: Array<string>;

  @IsInt()
  @Min(1)
  @IsOptional()
  presentationsPerPresentationBlock?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  presentationDuration?: number;

  @IsString()
  @IsOptional()
  callForPapersText?: string;

  @IsISO8601()
  @IsOptional()
  submissionDeadline?: Date;
}
