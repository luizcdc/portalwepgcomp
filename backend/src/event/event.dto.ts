import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsISO8601,
} from 'class-validator';

export class CreateEventRequestDTO {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsISO8601()
  startSubmissionDate: Date;

  @IsISO8601()
  endSubmissionDate: Date;

  @IsString()
  presentationDuration: string;

  @IsInt()
  @Min(1)
  presentationsPerSession: number;

  @IsBoolean()
  isEvaluationRestrictToLoggedUsers: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class EventResponseDTO {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsISO8601()
  startDate: Date;

  @IsISO8601()
  endDate: Date;

  @IsISO8601()
  startSubmissionDate: Date;

  @IsISO8601()
  endSubmissionDate: Date;

  @IsString()
  presentationDuration: string;

  @IsInt()
  presentationsPerSession: number;

  @IsBoolean()
  isEvaluationRestrictToLoggedUsers: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsISO8601()
  createdAt: Date;

  @IsISO8601()
  updatedAt: Date;
}
