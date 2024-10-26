import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto, Profile } from './user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { StudentService } from 'src/student/student.service';
import { ProfessorService } from 'src/professor/professor.service';

@Injectable()
export class UserService {
  constructor(
    private prismaClient: PrismaService,
    private studentService: StudentService,
    private professorService: ProfessorService,
  ) {}

  async create(createUserDto: CreateUserRequestDto) {
    const existingUser = await this.prismaClient.user.findFirst({
      where: {
        OR: [{ email: createUserDto.email }, { cpf: createUserDto.cpf }],
      },
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new AppException('Um usuário com esse email já existe.', 400);
      }

      if (existingUser.cpf === createUserDto.cpf) {
        throw new AppException('Um usuário com esse CPF já existe.', 400);
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let user = null;

    if (createUserDto.profile === Profile.DoctoralStudent) {
      user = await this.studentService.create({
        ...createUserDto,
        password: hashedPassword,
        registration: createUserDto.registration,
      });
    } else if (createUserDto.profile === Profile.Professor) {
      user = await this.professorService.create({
        ...createUserDto,
        password: hashedPassword,
        areaExpertise: createUserDto.areaExpertise,
        registration: createUserDto.registration,
      });
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }
}
