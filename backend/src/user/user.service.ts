import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
} from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppException } from 'src/exceptions/app.exception';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prismaClient: PrismaService) {}

  async registerStudent(
    createStudentDto: RegisterStudentRequestDto,
  ): Promise<RegisterStudentResponseDto> {
    const userExists = await this.prismaClient.student.findUnique({
      where: {
        email: createStudentDto.email,
      },
    });
    if (userExists) {
      throw new AppException('Um usuário com esse email já existe.', 400);
    }
    const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

    const newStudent = {
      data: {
        ...createStudentDto,
        status: UserStatus.ATIVO,
        password: hashedPassword,
      },
    };

    const user = await this.prismaClient.student.create(newStudent);
    const userResponseDto = new RegisterStudentResponseDto(user);

    return userResponseDto;
  }

  async registerTeacher(
    createTeacherDto: RegisterTeacherRequestDto,
  ): Promise<RegisterTeacherResponseDto> {
    const userExists = await this.prismaClient.teacher.findUnique({
      where: {
        email: createTeacherDto.email,
      },
    });
    if (userExists) {
      throw new AppException('Um usuário com esse email já existe.', 400);
    }

    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    const newTeacher = {
      data: {
        ...createTeacherDto,
        status: UserStatus.PENDENTE,
        password: hashedPassword,
      },
    };

    const user = await this.prismaClient.teacher.create(newTeacher);

    const userResponseDto = new RegisterTeacherResponseDto(user);
    return userResponseDto;
  }
}
