import { IsEmail } from 'class-validator';

export class DefaultEmailDto {
  from: string;
  @IsEmail()
  to: string;
  subject: string;
  text: string;
}

export class DefaultEmailResponseDto {
  message: string;
}

export class ContactRequestDto {
  name: string;

  @IsEmail()
  email: string;

  text: string;
}

export class ContactResponseDto {
  message: string;
}
