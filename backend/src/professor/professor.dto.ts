import { User } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { CreateUserRequestDto } from 'src/user/user.dto';

export class RegisterProfessorRequestDto extends CreateUserRequestDto {
  @IsOptional()
  @IsString()
  areaExpertise: string;

  @IsString()
  registration: string;
}

export class RegisterProfessorResponseDto {
  id: string;
  name: string;
  email: string;
  areaExpertise?: string;
  photoFilePath?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User & { professor: { areaExpertise: string } }) {
    this.id = user.id.toString();
    this.name = user.name;
    this.email = user.email;
    this.areaExpertise = user.professor.areaExpertise;
    this.photoFilePath = user.photoFilePath;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
