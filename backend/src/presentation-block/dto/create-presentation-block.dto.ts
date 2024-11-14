import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsISO8601,
  IsInt,
  Min,
  Max,
  MinLength,
} from 'class-validator';
// import annotations from swagger

import { ApiProperty } from '@nestjs/swagger';

import { PresentationBlockType } from '@prisma/client';

export class CreatePresentationBlockDto {
  @IsUUID()
  eventEditionId: string;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsEnum(PresentationBlockType, {
    message: 'Opção inválida.',
  })
  @ApiProperty({
    enum: PresentationBlockType,
    example: PresentationBlockType.Presentation,
  })
  type: PresentationBlockType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, {
    // 2 characters is a reasonable minimum length taking into account someone might use
    // a company's abbreviation here, like IBM or AWS.
    message: 'O nome do palestrante deve ter no mínimo 2 caracteres.',
  })
  speakerName?: string;

  @IsISO8601(
    {},
    {
      message:
        'A data de início da sessão deve estar no formato ISO 8601 (yyyy-mm-ddThh:mm:ss).',
    },
  )
  startTime: Date;

  @IsInt({
    message:
      'A duração da sessão deve ser expressada como o número de minutos de duração.',
  })
  @Min(5, {
    message: 'A sessão deve ter no mínimo 5 minutos de duração',
  })
  @Max(720, {
    message: 'A sessão não pode durar mais que 12 horas',
  })
  duration: number;
}
