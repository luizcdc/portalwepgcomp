import { User, UserStatus } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Level {
  MESTRADO = 'MESTRADO',
  DOUTORADO = 'DOUTORADO',
}

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

  @IsEnum(Level)
  level: Level;

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
  status: UserStatus; // Pode ser 'Pendente' ou 'Ativo'
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User & { student: { registration: string } }) {
    this.id = user.id;
    this.name = user.name;
    this.registration = user.student.registration;
    this.email = user.email;
    this.photo = user.photo;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
