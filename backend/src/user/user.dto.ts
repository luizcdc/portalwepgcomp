import { UserStatus, Teacher, Student } from '@prisma/client';
import { IsEmail, IsNotEmpty, Matches, IsOptional } from 'class-validator';

// DTOs para Requests

export class RegisterStudentRequestDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  surname?: string;

  @IsNotEmpty()
  registration: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  advisor: string;

  @IsOptional()
  photo?: string;

  @IsNotEmpty()
  program: string; // Exemplos: 'mestrado', 'doutorado', 'ic', 'graduação'

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, quatro números e um caractere especial.',
    },
  )
  password: string;
}

export class RegisterTeacherRequestDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  surname?: string;

  @IsNotEmpty()
  registration: string;

  @IsEmail()
  email: string;

  @IsOptional()
  photo?: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, quatro números e um caractere especial.',
    },
  )
  password: string;
}

// DTOs para Responses

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

  constructor(user: Student) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.registration = user.registration;
    this.email = user.email;
    this.advisor = user.advisor;
    this.photo = user.photo;
    this.program = user.program;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
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

  constructor(user: Teacher) {
    this.id = user.id;
    this.name = user.name;
    this.surname = user.surname;
    this.registration = user.registration;
    this.email = user.email;
    this.photo = user.photo;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
