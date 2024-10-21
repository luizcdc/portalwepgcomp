import {
  IsEmail,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

// DTOs para Requests
export enum Profile {
  Professor = 'Professor',
  DoctoralStudent = 'DoctoralStudent',
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
  photoFilePath?: string;

  @IsNotEmpty()
  @IsEnum(Profile)
  profile: Profile;

  // Campos específicos para Professor
  @IsOptional()
  @IsString()
  areaExpertise?: string;

  // Campos específicos para Student
  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  registration?: string;
}
