import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, SetAdminDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { Prisma, Profile, UserAccount, UserLevel } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaClient: PrismaService) {}

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
      },
    });

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

  async activateProfessor(userId: string) {
    const user = await this.prismaClient.userAccount.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppException('Usuário não encontrado', 404);
    }

    if (user.profile !== 'Professor') {
      throw new AppException('Este usuário não é um professor', 403);
    }

    if (user.isActive) {
      throw new AppException('O usuário já está ativo', 409);
    }

    const updatedUser = await this.prismaClient.userAccount.update({
      where: { id: userId },
      data: {
        isActive: true,
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
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users.map((user) => new ResponseUserDto(user));
  }
}
