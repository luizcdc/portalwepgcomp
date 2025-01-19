import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { Prisma, Profile, UserAccount, UserLevel } from '@prisma/client';
import { MailingService } from '../mailing/mailing.service';

@Injectable()
export class UserService {
  constructor(
    private prismaClient: PrismaService,
    private jwtService: JwtService,
    private mailingService: MailingService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.prismaClient.userAccount.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (emailExists) {
      throw new AppException('Um usuário com esse email já existe.', 400);
    }

    if (
      (createUserDto.profile !== 'Listener' || !createUserDto.profile) &&
      !createUserDto.registrationNumber
    ) {
      throw new AppException(
        'O número de matrícula é obrigatório para estudantes de doutorado e professores.',
        400,
      );
    }

    if (createUserDto.registrationNumber) {
      const registrationExists = await this.prismaClient.userAccount.findUnique(
        {
          where: {
            registrationNumber: createUserDto.registrationNumber,
          },
        },
      );
      if (registrationExists) {
        throw new AppException('Um usuário com essa matrícula já existe.', 400);
      }
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(createUserDto.password)) {
      throw new AppException(
        'A senha deve conter pelo menos 8 caracteres, incluindo pelo menos uma letra, um número e pode conter caracteres especiais.',
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let shouldBeSuperAdmin = false;

    if (createUserDto.profile === Profile.Professor) {
      shouldBeSuperAdmin = await this.checkProfessorShouldBeSuperAdmin();
    }

    const createdUser = await this.prismaClient.userAccount.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        level: shouldBeSuperAdmin ? UserLevel.Superadmin : UserLevel.Default,
        isActive: createUserDto.profile === Profile.Professor && !shouldBeSuperAdmin ? false : true,
      },
    });

    if (createdUser.isVerified === false) {
      const token = await this.generateEmailToken(createdUser.id);
      await this.mailingService.sendEmailConfirmation(createdUser.email, token);
      await this.prismaClient.emailVerification.create({
        data: {
          userId: createdUser.id,
          emailVerificationToken: token,
          emailVerificationSentAt: new Date(),
        },
      });
    }

    const responseUserDto = new ResponseUserDto(createdUser);

    return responseUserDto;
  }

  async findByEmail(email: string) {
    const user = await this.prismaClient.userAccount.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async checkProfessorShouldBeSuperAdmin(): Promise<boolean> {
    const professorsCount = await this.prismaClient.userAccount.count({
      where: {
        profile: Profile.Professor,
      },
    });

    return professorsCount > 0 ? false : true;
  }

  async setDefault(setDefaultDto: SetAdminDto): Promise<ResponseUserDto> {
    const { requestUserId, targetUserId } = setDefaultDto;

    const requestUser = await this.prismaClient.userAccount.findFirst({
      where: {
        id: requestUserId,
      },
    });

    if (!requestUser) {
      throw new AppException('Usuário solicitante não encontrado.', 404);
    }

    if (!this.isAdmin(requestUser)) {
      throw new AppException(
        'O usuário não possui privilégios de administrador ou super administrador.',
        403,
      );
    }

    const targetUser = await this.prismaClient.userAccount.findFirst({
      where: {
        id: targetUserId,
      },
    });

    if (!targetUser) {
      throw new AppException('Usuário-alvo não encontrado.', 404);
    }

    if (
      targetUser.level === UserLevel.Superadmin &&
      requestUser.level === UserLevel.Admin
    ) {
      throw new AppException(
        'Um usuário administrador não tem permissão para rebaixar um super administrador.',
        403,
      );
    }

    const updatedTargetUser = await this.prismaClient.userAccount.update({
      where: {
        id: targetUserId,
      },
      data: {
        level: UserLevel.Default,
      },
    });

    const responseUserDto = new ResponseUserDto(updatedTargetUser);

    return responseUserDto;
  }

  async setAdmin(setAdminDto: SetAdminDto): Promise<ResponseUserDto> {
    const { requestUserId, targetUserId } = setAdminDto;

    const requestUser = await this.prismaClient.userAccount.findFirst({
      where: {
        id: requestUserId,
      },
    });

    if (!requestUser) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    if (!this.isAdmin(requestUser)) {
      throw new AppException(
        'O usuário não possui privilégios de administrador ou super administrador.',
        403,
      );
    }

    try {
      const targetUser = await this.prismaClient.userAccount.update({
        where: {
          id: targetUserId,
        },
        data: {
          level: UserLevel.Admin,
        },
      });

      const responseUserDto = new ResponseUserDto(targetUser);

      return responseUserDto;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new AppException('Usuário-alvo não encontrado', 404);
      }

      throw new Error(e);
    }
  }

  async setSuperAdmin(setAdminDto: SetAdminDto): Promise<ResponseUserDto> {
    const { requestUserId, targetUserId } = setAdminDto;

    const requestUser = await this.prismaClient.userAccount.findFirst({
      where: {
        id: requestUserId,
      },
    });

    if (!requestUser) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    if (requestUser.level !== 'Superadmin') {
      throw new AppException(
        'O usuário não possui privilégios de super administrador.',
        403,
      );
    }

    try {
      const targetUser = await this.prismaClient.userAccount.update({
        where: {
          id: targetUserId,
        },
        data: {
          level: UserLevel.Superadmin,
        },
      });

      const responseUserDto = new ResponseUserDto(targetUser);

      return responseUserDto;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new AppException('Usuário-alvo não encontrado', 404);
      }

      throw new Error(e);
    }
  }

  async remove(id: string) {
    const userExists = await this.prismaClient.userAccount.findUnique({
      where: {
        id,
      },
    });

    if (!userExists) {
      throw new AppException('Usuário não encontrado.', 404);
    }

    await this.prismaClient.userAccount.delete({
      where: {
        id,
      },
    });

    return { message: 'Cadastro de Usuário removido com sucesso.' };
  }

  async toggleUserActivation(userId: string, activated: boolean) {
    const user = await this.prismaClient.userAccount.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppException('Usuário não encontrado', 404);
    }

    if (activated && user.isActive) {
      throw new AppException('O usuário já está ativo', 409);
    }

    if (!activated && !user.isActive) {
      throw new AppException('O usuário já está desativado', 409);
    }

    const newStatus = activated ? true : false;

    const updatedUser = await this.prismaClient.userAccount.update({
      where: { id: userId },
      data: {
        isActive: newStatus,
      },
    });

    return updatedUser;
  }

  isAdmin(user: UserAccount): boolean {
    return ['Admin', 'Superadmin'].includes(user.level);
  }

  async findAll(
    roles?: string | string[],
    profiles?: string | string[],
  ): Promise<ResponseUserDto[]> {
    const whereClause: any = {};
    if (roles) {
      if (Array.isArray(roles) && roles.length > 0) {
        whereClause.level = { in: roles };
      } else if (typeof roles === 'string') {
        whereClause.level = roles;
      }
    }

    if (profiles) {
      if (Array.isArray(profiles) && profiles.length > 0) {
        whereClause.profile = { in: profiles };
      } else if (typeof profiles === 'string') {
        whereClause.profile = profiles;
      }
    }

    const users = await this.prismaClient.userAccount.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        registrationNumber: true,
        photoFilePath: true,
        profile: true,
        level: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => new ResponseUserDto(user));
  }

  private async generateEmailToken(userId: string): Promise<string> {
    const payload = { id: userId };
    return this.jwtService.sign(payload, { expiresIn: '24h' });
  }

  private async isTokenUsed(token: string): Promise<boolean> {
    const tokenRecord = await this.prismaClient.emailVerification.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerifiedAt: {
          not: null,
        },
      },
    });

    return !!tokenRecord;
  }

  async confirmEmail(token: string): Promise<boolean> {
    try {
      const tokenUsed = await this.isTokenUsed(token);
      if (tokenUsed) {
        throw new AppException('Token já utilizado.', 400);
      }
      const { id } = this.jwtService.verify(token);
      const user = await this.prismaClient.$transaction(async (prisma) => {
        const updatedUser = await prisma.userAccount.update({
          where: { id },
          data: { isVerified: true },
        });

        await prisma.emailVerification.update({
          where: { userId: id },
          data: { emailVerifiedAt: new Date() },
        });

        return updatedUser;
      });

      return !!user;
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new AppException('Token inválido ou expirado.', 400);
      }
      throw error;
    }
  }
}
