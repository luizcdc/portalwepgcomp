import { Injectable } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
} from './user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaClient: PrismaService) {}

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
