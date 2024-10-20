import { Injectable } from '@nestjs/common';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
} from './student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Perfil, UserStatus } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prismaClient: PrismaService) {}

  async create(createStudentDto: RegisterStudentRequestDto) {
    const { registration, level, biography, ...userData } = createStudentDto;

    const createdStudent = await this.prismaClient.user.create({
      data: {
        ...userData,
        perfil: Perfil.STUDENT,
        status: UserStatus.ACTIVE,
        student: {
          create: {
            registration,
            level,
            biography,
          },
        },
      },
      include: {
        student: true,
      },
    });

    const studentResponse = new RegisterStudentResponseDto(createdStudent);

    return studentResponse;
  }
}
