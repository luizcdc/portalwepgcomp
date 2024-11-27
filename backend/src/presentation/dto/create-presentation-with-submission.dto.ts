import { IsString, IsOptional, IsEnum,  MinLength, IsUUID, IsNotEmpty, IsInt, Min } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';
import { PresentationStatus } from '@prisma/client';

export class CreatePresentationWithSubmissionDto {
  @IsUUID()
  advisorId: string;

  @IsUUID()
  mainAuthorId: string;

  @IsUUID()
  eventEditionId: string;

  @IsString()
  @MinLength(5, { message: 'O título deve ter pelo menos 5 caracteres.' })
  title: string;

  @IsString()
  @MinLength(10, { message: 'O abstract deve ter pelo menos 10 caracteres.' })
  abstractText: string;

  @IsString()
  pdfFile: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsEnum(SubmissionStatus, { message: 'Status de submissão inválido.' })
  submissionStatus: SubmissionStatus;

  @IsString()
  @IsOptional()
  coAdvisor?: string;

  @IsUUID()
  @IsNotEmpty()
  presentationBlockId: string;

  @IsInt({
    message: 'A posição da apresentação deve ser um número inteiro.',
  })
  @Min(0, {
    message: 'A posição da apresentação deve ser um número não negativo.',
  })
  @IsNotEmpty()
  positionWithinBlock: number;

  @IsEnum(PresentationStatus)
  @IsOptional()
  status?: PresentationStatus;
}