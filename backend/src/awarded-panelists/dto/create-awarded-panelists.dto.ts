import { IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAwardedPanelistDto {
  @ApiProperty({
    description: 'The unique identifier of the panelist user',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid',
  })
  @IsUUID()
  userId: string;
}

export class CreateAwardedPanelistsDto {
  @ApiProperty({
    description: 'The unique identifier of the event edition',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  eventEditionId: string;

  @ApiProperty({
    description: 'Array of panelists to be awarded',
    type: [CreateAwardedPanelistDto],
    example: [
      {
        userId: '123e4567-e89b-12d3-a456-426614174001',
      },
      {
        userId: '123e4567-e89b-12d3-a456-426614174002',
      },
    ],
  })
  @IsArray()
  panelists: CreateAwardedPanelistDto[];
}
