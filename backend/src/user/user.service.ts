import { Injectable } from '@nestjs/common';
import { PrismaClient, UserStatus } from '@prisma/client';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
} from './user.dto';

@Injectable()
export class UserService {
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async registerStudent(
    createStudentDto: RegisterStudentRequestDto,
  ): Promise<RegisterStudentResponseDto> {
    const newStudent = {
      data: {
        ...createStudentDto,
        status: UserStatus.ATIVO,
      },
    };

    const user = await this.prismaClient.student.create(newStudent);

    return user;
  }

  async registerTeacher(
    createTeacherDto: RegisterTeacherRequestDto,
  ): Promise<RegisterTeacherResponseDto> {
    const newTeacher = {
      data: {
        ...createTeacherDto,
        status: UserStatus.PENDENTE,
      },
    };

    const user = await this.prismaClient.teacher.create(newTeacher);

    return user;
  }
}
