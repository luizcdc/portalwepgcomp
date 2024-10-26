import { Injectable } from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/exceptions/app.exception';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(data: SignInDto): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(data.email);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new AppException('Email ou senha inválido', 400);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      token,
    };
  }
}
