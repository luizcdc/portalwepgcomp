import { Body, Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  login(@Body() loginUserDto: any): any {
    console.log(loginUserDto);

    return '';
  }
}
