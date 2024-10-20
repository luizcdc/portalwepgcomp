import { Injectable } from '@nestjs/common';
import {
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
} from './teacher.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Perfil, UserStatus } from '@prisma/client';

@Injectable()
export class TeacherService {
  constructor(private prismaClient: PrismaService) {}

  async create(createTeacherDto: RegisterTeacherRequestDto) {
    const { registration, expertiseArea, ...userData } = createTeacherDto;

    const createdTeacher = await this.prismaClient.user.create({
      data: {
        ...userData,
        perfil: Perfil.STUDENT,
        status: UserStatus.ACTIVE,
        teacher: {
          create: {
            registration,
            expertiseArea,
          },
        },
      },
      include: {
        teacher: true,
      },
    });

    const teacherResponse = new RegisterTeacherResponseDto(createdTeacher);

    return teacherResponse;
  }
}
