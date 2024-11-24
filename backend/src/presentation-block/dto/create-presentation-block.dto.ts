import {
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  IsInt,
  Min,
  Max,
  MinLength,
  IsNotEmpty,
  isISO8601,
} from 'class-validator';

import { Transform } from 'class-transformer';

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

  @IsNotEmpty()
  @Transform(({ value }) => {
    if (!isISO8601(value)) {
      throw new Error(
        'A data de início da sessão deve ser uma data válida no formato ISO8601.',
      );
    }
    return new Date(value);
  })
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

  @IsOptional()
  @IsUUID('4', {
    each: true,
    message: 'O ID de um dos avaliadores informados é inválido.',
  })
  panelists?: string[];

  @IsOptional()
  @IsUUID('4', {
    each: true,
    message: 'O ID de uma das apresentações informadas é inválido.',
  })
  presentations?: string[];
}
