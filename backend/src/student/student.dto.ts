import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterStudentRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsString()
  registration: string;
}

export class RegisterStudentResponseDto {
  id: string;
  name: string;
  surname?: string;
  registration: string;
  email: string;
  advisor: string;
  photo?: string;
  program: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User & { student: { registration: string } }) {
    this.id = String(user.id);
    this.name = user.name;
    this.registration = user.student.registration;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
