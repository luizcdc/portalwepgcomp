// src/submissions/dto/co-author.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CoAuthorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  institution: string;
}
