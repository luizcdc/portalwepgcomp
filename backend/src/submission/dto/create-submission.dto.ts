import { IsString, IsOptional, IsEnum, IsArray, IsPhoneNumber, IsUrl } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';
import { CoAuthorDto } from './co-author.dto';

export class CreateSubmissionDto {
  @IsString()
  advisorId: string;

  @IsString()
  mainAuthorId: string;

  @IsString()
  eventEditionId: string;

  @IsString()
  title: string;

  @IsString()
  abstract: string;

  @IsString()
  pdfFile: string;

  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsUrl({}, { message: 'A URL do LinkedIn não é válida.' })
  linkedinUrl?: string;

  @IsEnum(SubmissionStatus, { message: 'Status de submissão inválido.' })
  status: SubmissionStatus;

  @IsArray()
  @IsOptional()
  coAuthors?: CoAuthorDto[];
}
