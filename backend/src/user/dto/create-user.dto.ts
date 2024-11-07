import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  Length,
} from 'class-validator';

export enum Profile {
  DoctoralStudent = 'DoctoralStudent',
  Professor = 'Professor',
  Listener = 'Listener',
}

export enum UserLevel {
  Superadmin = 'Superadmin',
  Admin = 'Admin',
  Default = 'Default',
}

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  photoFilePath?: string;

  @IsOptional()
  @IsEnum(Profile)
  profile?: Profile;

  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
