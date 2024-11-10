import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppException } from 'src/exceptions/app.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailingService } from 'src/mailing/mailing.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaClient: PrismaService,
    private mailingService: MailingService,
  ) {}

  async signIn(data: SignInDto): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(data.email);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new AppException('Email ou senha inválido', 400);
    }

    const payload = {
      userId: user.id,
      email: user.email,
      level: user.level,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      token,
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const resetToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    const text = `Link para redefinição de senha: ${process.env.FRONTEND_URL}/AlterarSenha/${resetToken}`;
    const forgotPasswordEmail = {
      from: `"${user.name}" <${user.email}>`,
      to: user.email,
      subject: 'Redefinição de senha: WEPGCOMP',
      text,
    };

    await this.mailingService.sendEmail(forgotPasswordEmail);

    return { message: 'Token de redefinição de senha enviado.' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Decodificar e verificar o token
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    // Atualizar a senha do usuário
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prismaClient.userAccount.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }
}
