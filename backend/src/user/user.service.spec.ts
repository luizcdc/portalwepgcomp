import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '@prisma/client';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            student: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
            professor: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerStudent', () => {
    it('should throw an AppException if the student already exists', async () => {
      prismaService.student.findUnique = jest.fn().mockResolvedValue(true);

      const createStudentDto = {
        email: 'student@example.com',
        password: 'password123',
        name: 'John',
        registration: '2021001',
        advisor: 'Dr. Smith',
        program: 'Computer Science',
      };

      await expect(service.registerStudent(createStudentDto)).rejects.toThrow(
        new AppException('Um usuário com esse email já existe.', 400),
      );
    });

    it('should hash the password and create a new student', async () => {
      prismaService.student.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.student.create = jest.fn().mockResolvedValue({
        id: '123',
        email: 'student@example.com',
        name: 'John',
        surname: null,
        registration: '2021001',
        advisor: 'Dr. Smith',
        photo: null,
        program: 'Computer Science',
        status: UserStatus.ATIVO,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createStudentDto = {
        email: 'student@example.com',
        password: 'password123',
        name: 'John',
        registration: '2021001',
        advisor: 'Dr. Smith',
        program: 'Computer Science',
      };

      const result = await service.registerStudent(createStudentDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaService.student.create).toHaveBeenCalledWith({
        data: {
          ...createStudentDto,
          password: hashedPassword,
          status: UserStatus.ATIVO,
        },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: '123',
          email: 'student@example.com',
          name: 'John',
          status: UserStatus.ATIVO,
        }),
      );
    });
  });

  describe('registerProfessor', () => {
    it('should throw an AppException if the professor already exists', async () => {
      prismaService.professor.findUnique = jest.fn().mockResolvedValue(true);

      const createProfessorDto = {
        email: 'professor@example.com',
        password: 'password123',
        name: 'Jane',
        registration: 'T2021001',
      };

      await expect(service.registerProfessor(createProfessorDto)).rejects.toThrow(
        new AppException('Um usuário com esse email já existe.', 400),
      );
    });

    it('should hash the password and create a new professor', async () => {
      prismaService.professor.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.professor.create = jest.fn().mockResolvedValue({
        id: '456',
        email: 'professor@example.com',
        name: 'Jane',
        surname: null,
        registration: 'T2021001',
        photo: null,
        status: UserStatus.PENDENTE,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createProfessorDto = {
        email: 'professor@example.com',
        password: 'password123',
        name: 'Jane',
        registration: 'T2021001',
      };

      const result = await service.registerProfessor(createProfessorDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaService.professor.create).toHaveBeenCalledWith({
        data: {
          ...createProfessorDto,
          password: hashedPassword,
          status: UserStatus.PENDENTE,
        },
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: '456',
          email: 'professor@example.com',
          name: 'Jane',
          status: UserStatus.PENDENTE,
        }),
      );
    });
  });
});
