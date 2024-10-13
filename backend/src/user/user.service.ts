import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
} from './user.dto';
import { v4 as uuidv4 } from 'uuid';

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
        id: uuidv4(),
        ...createStudentDto,
        status: 'Ativo',
        createdAt: new Date(),
        updatedAt: new Date(),
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
        id: uuidv4(),
        ...createTeacherDto,
        status: 'Pendente',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const user = await this.prismaClient.teacher.create(newTeacher);

    return user;
  }
}
