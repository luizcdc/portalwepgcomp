import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterProfessorRequestDto,
  RegisterProfessorResponseDto,
} from './user.dto';
import { UserStatus } from '@prisma/client';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            registerStudent: jest.fn(),
            registerProfessor: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerStudent', () => {
    it('should register a student and return a RegisterStudentResponseDto', async () => {
      const registerStudentDto: RegisterStudentRequestDto = {
        name: 'John',
        surname: 'Doe',
        registration: '2021001',
        email: 'student@example.com',
        advisor: 'Dr. Smith',
        photo: 'student-photo-url',
        program: 'mestrado',
        password: 'Password@1234',
      };

      const studentResponse: RegisterStudentResponseDto = {
        id: '1',
        name: 'John',
        surname: 'Doe',
        registration: '2021001',
        email: 'student@example.com',
        advisor: 'Dr. Smith',
        photo: 'student-photo-url',
        program: 'mestrado',
        status: UserStatus.ATIVO,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(userService, 'registerStudent')
        .mockResolvedValue(studentResponse);

      const result = await controller.registerStudent(registerStudentDto);

      expect(userService.registerStudent).toHaveBeenCalledWith(
        registerStudentDto,
      );
      expect(result).toEqual(studentResponse);
    });
  });

  describe('registerProfessor', () => {
    it('should register a professor and return a RegisterProfessorResponseDto', async () => {
      const registerProfessorDto: RegisterProfessorRequestDto = {
        name: 'Jane',
        surname: 'Smith',
        registration: 'T2021001',
        email: 'professor@example.com',
        photo: 'professor-photo-url',
        password: 'Password@1234',
      };

      const professorResponse: RegisterProfessorResponseDto = {
        id: '2',
        name: 'Jane',
        surname: 'Smith',
        registration: 'T2021001',
        email: 'professor@example.com',
        photo: 'professor-photo-url',
        status: UserStatus.PENDENTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(userService, 'registerProfessor')
        .mockResolvedValue(professorResponse);

      const result = await controller.registerProfessor(registerProfessorDto);

      expect(userService.registerProfessor).toHaveBeenCalledWith(
        registerProfessorDto,
      );
      expect(result).toEqual(professorResponse);
    });
  });
});
