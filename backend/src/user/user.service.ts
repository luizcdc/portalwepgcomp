import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

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
      createUserDto.profile === 'DoctoralStudent' &&
      !createUserDto.registrationNumber
    ) {
      throw new AppException(
        'O número de matrícula é obrigatório para estudantes de doutorado.',
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

    const createdUser = await this.prismaClient.userAccount.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
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
}
