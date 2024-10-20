import { User, UserStatus } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterTeacherRequestDto {
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

  @IsString()
  expertiseArea: string;

  @IsString()
  registration: string;
}

export class RegisterTeacherResponseDto {
  id: string;
  name: string;
  surname?: string;
  registration: string;
  email: string;
  photo?: string;
  status: UserStatus; // Pode ser 'Pendente' ou 'Ativo'
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User & { teacher: { registration: string } }) {
    this.id = user.id;
    this.name = user.name;
    this.registration = user.teacher.registration;
    this.email = user.email;
    this.photo = user.photo;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
