import { User } from '@prisma/client';
import {
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateUserRequestDto } from 'src/user/user.dto';

export class RegisterStudentRequestDto extends CreateUserRequestDto {
  @IsOptional()
  @IsString()
  biography?: string;

  @IsString()
  registration: string;
}

export class RegisterStudentResponseDto {
  id: string;
  name: string;
  registration: string;
  email: string;
  photoFilePath?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User & { doctoralStudent: { registration: string } }) {
    this.id = user.id.toString();
    this.name = user.name;
    this.registration = user.doctoralStudent.registration;
    this.email = user.email;
    this.photoFilePath = user.photoFilePath;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
