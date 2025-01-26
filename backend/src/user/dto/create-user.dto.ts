import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  Length,
  ValidateIf,
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

  @ValidateIf((object) => object.profile === Profile.DoctoralStudent)
  @IsString()
  @Length(1, 20)
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  photoFilePath?: string;

  @IsEnum(Profile)
  profile?: Profile;

  @IsOptional()
  @IsEnum(UserLevel)
  level?: UserLevel;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class SetAdminDto {
  @IsString()
  @Length(36)
  requestUserId: string;

  @IsString()
  @Length(36)
  targetUserId: string;
}
