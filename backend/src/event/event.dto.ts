import { Event } from '@prisma/client';
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
}

export class UpdateEventRequestDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsISO8601()
  startDate?: Date;

  @IsOptional()
  @IsISO8601()
  endDate?: Date;

  @IsOptional()
  @IsISO8601()
  startSubmissionDate?: Date;

  @IsOptional()
  @IsISO8601()
  endSubmissionDate?: Date;

  @IsOptional()
  @IsString()
  presentationDuration?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  presentationsPerSession?: number;

  @IsOptional()
  @IsBoolean()
  isEvaluationRestrictToLoggedUsers?: boolean;
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

  constructor(data: Event) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.url = data.url;
    this.location = data.location;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.startSubmissionDate = data.startSubmissionDate;
    this.endSubmissionDate = data.endSubmissionDate;
    this.presentationDuration = data.presentationDuration;
    this.presentationsPerSession = data.presentationsPerSession;
    this.isEvaluationRestrictToLoggedUsers =
      data.isEvaluationRestrictToLoggedUsers;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
