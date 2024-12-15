import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  @ApiProperty({ example: 'd91250a6-790a-43ce-9688-004d88e33d5a' })
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
