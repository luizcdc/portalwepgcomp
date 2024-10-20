import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto, Perfil } from './user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { StudentService } from 'src/student/student.service';
import { TeacherService } from 'src/teacher/teacher.service';

@Injectable()
export class UserService {
  constructor(
    private prismaClient: PrismaService,
    private studentService: StudentService,
    private teacherService: TeacherService,
  ) {}

  async create(createUserDto: CreateUserRequestDto) {
    if (!createUserDto.registration) {
      throw new AppException('Matrícula é obrigatório', 400);
    }

    const userExists = await this.prismaClient.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (userExists) {
      throw new AppException('Um usuário com esse email já existe.', 400);
    }

    const cpfExists = await this.prismaClient.user.findUnique({
      where: {
        cpf: createUserDto.cpf,
      },
    });
    if (cpfExists) {
      throw new AppException('Um usuário com esse cpf já existe.', 400);
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let user = null;

    if (createUserDto.perfil === Perfil.STUDENT) {
      if (!createUserDto.level) {
        throw new AppException('Nível é obrigatório para estudantes.', 400);
      }

      user = await this.studentService.create({
        ...createUserDto,
        password: hashedPassword,
        level: createUserDto.level,
        registration: createUserDto.registration,
      });
    } else if (createUserDto.perfil === Perfil.TEACHER) {
      if (!createUserDto.expertiseArea) {
        throw new AppException(
          'Área de expertise é obrigatório para professores.',
          400,
        );
      }
      user = await this.teacherService.create({
        ...createUserDto,
        password: hashedPassword,
        expertiseArea: createUserDto.expertiseArea,
        registration: createUserDto.registration,
      });
    }

    return user;
  }
}
