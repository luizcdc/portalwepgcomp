import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { PresentationStatus } from '@prisma/client';

export class CreatePresentationDto {
  @IsString()
  @IsNotEmpty()
  submissionId: string;

  @IsString()
  @IsNotEmpty()
  presentationBlockId: string;

  @IsString()
  positionWithinBlock: string;

  @IsEnum(PresentationStatus)
  @IsOptional()
  status?: PresentationStatus;
}