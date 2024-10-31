import { Injectable } from '@nestjs/common';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
} from './student.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class StudentService {
  constructor(private prismaClient: PrismaService) {}

  async create(createStudentDto: RegisterStudentRequestDto) {
    const { registration, biography, ...userData } = createStudentDto;

    const createdStudent = await this.prismaClient.user.create({
      data: {
        ...userData,
        profile: Profile.DoctoralStudent,
        doctoralStudent: {
          create: {
            registration,
            biography,
          },
        },
      },
      include: {
        doctoralStudent: true,
      },
    });

    const studentResponse = new RegisterStudentResponseDto(createdStudent);

    return studentResponse;
  }
}
