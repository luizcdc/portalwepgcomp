import { IsNotEmpty, IsOptional, IsEnum, IsInt, IsUUID, Min } from 'class-validator';
import { PresentationStatus } from '@prisma/client';

export class CreatePresentationDto {
  @IsUUID()
  @IsNotEmpty()
  submissionId: string;

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