import { Injectable } from '@nestjs/common';
import {
  RegisterProfessorRequestDto,
  RegisterProfessorResponseDto,
} from './professor.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Profile } from '@prisma/client';

@Injectable()
export class ProfessorService {
  constructor(private prismaClient: PrismaService) {}

  async create(createProfessorDto: RegisterProfessorRequestDto) {
    const { areaExpertise, ...userData } = createProfessorDto;

    const createdProfessor = await this.prismaClient.user.create({
      data: {
        ...userData,
        profile: Profile.Professor,
        professor: {
          create: {
            areaExpertise,
          },
        },
      },
      include: {
        professor: true,
      },
    });

    const professorResponse = new RegisterProfessorResponseDto(createdProfessor);

    return professorResponse;
  }
}
