import {
  IsEmail,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

// DTOs para Requests
export enum Perfil {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

enum Level {
  MESTRADO = 'MESTRADO',
  DOUTORADO = 'DOUTORADO',
}

export class CreateUserRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d{4,})(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, quatro números e um caractere especial.',
    },
  )
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsNotEmpty()
  @IsEnum(Perfil)
  perfil: Perfil;

  // Campos específicos para Professor
  @IsOptional()
  @IsString()
  expertiseArea?: string;

  // Campos específicos para Student
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @IsOptional()
  @IsString()
  biography?: string;

  // Campos que tem nos dois mas potencialmente em formatos diferentes
  @IsOptional()
  @IsString()
  registration?: string;
}
