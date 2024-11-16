import { IsString, IsOptional, IsEnum, IsArray, IsUrl, MinLength } from 'class-validator';
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
  @MinLength(5, { message: 'O título deve ter pelo menos 5 caracteres.' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'O resumo deve ter pelo menos 10 caracteres.' })
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
