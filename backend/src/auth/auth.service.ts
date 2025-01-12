import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignInDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppException } from '../exceptions/app.exception';
import { PrismaService } from '../prisma/prisma.service';
import { MailingService } from '../mailing/mailing.service';
import { UserAccount } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaClient: PrismaService,
    private mailingService: MailingService,
  ) {}

  async signIn(
    userData: SignInDto,
  ): Promise<{ token: string; data: Partial<UserAccount> }> {
    const user = await this.userService.findByEmail(userData.email);

    if (!user) {
      throw new AppException('Email ou senha inválido', 400);
    }

    if (!(await bcrypt.compare(userData.password, user.password))) {
      throw new AppException('Email ou senha inválido', 400);
    }

    const payload = {
      userId: user.id,
      level: user.level,
      email: user.email,
    };

    const data = {
      id: user.id,
      name: user.name,
      profile: user.profile,
      level: user.level,
      isActive: user.isActive,
    };

    const token = await this.jwtService.signAsync(payload);
    return {
      token,
      data,
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

    const text = `Link para redefinição de senha: ${process.env.FRONTEND_URL}/alterar-senha/${resetToken}`;
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

    if (!newPassword.match(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)) {
      throw new AppException(
        'A senha deve ter pelo menos 8 caracteres, incluindo pelo menos uma letra, um número e pode conter qualquer caractere, incluindo espaços.',
        400,
      );
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
