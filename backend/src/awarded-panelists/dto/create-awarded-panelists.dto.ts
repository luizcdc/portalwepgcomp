import { IsArray, ArrayNotEmpty, IsUUID } from 'class-validator';

export class CreateAwardedPanelistDto {
  @IsUUID()
  userId: string;
}

export class CreateAwardedPanelistsDto {
  @IsUUID()
  eventEditionId: string;

  @IsArray()
  @ArrayNotEmpty()
  panelists: CreateAwardedPanelistDto[];
}