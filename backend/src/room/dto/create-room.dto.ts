import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsUUID()
  eventEditionId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
