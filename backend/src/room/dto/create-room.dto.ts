import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  @ApiProperty({ example: 'e691f604-ea01-4ffa-9f77-3df417490ca2' })
  eventEditionId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Sala A' })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Primeiro andar' })
  description?: string;
}
