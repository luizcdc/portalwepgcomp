import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  RegisterStudentRequestDto,
  RegisterStudentResponseDto,
  RegisterTeacherRequestDto,
  RegisterTeacherResponseDto,
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
            registerTeacher: jest.fn(),
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

  describe('registerTeacher', () => {
    it('should register a teacher and return a RegisterTeacherResponseDto', async () => {
      const registerTeacherDto: RegisterTeacherRequestDto = {
        name: 'Jane',
        surname: 'Smith',
        registration: 'T2021001',
        email: 'teacher@example.com',
        photo: 'teacher-photo-url',
        password: 'Password@1234',
      };

      const teacherResponse: RegisterTeacherResponseDto = {
        id: '2',
        name: 'Jane',
        surname: 'Smith',
        registration: 'T2021001',
        email: 'teacher@example.com',
        photo: 'teacher-photo-url',
        status: UserStatus.PENDENTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(userService, 'registerTeacher')
        .mockResolvedValue(teacherResponse);

      const result = await controller.registerTeacher(registerTeacherDto);

      expect(userService.registerTeacher).toHaveBeenCalledWith(
        registerTeacherDto,
      );
      expect(result).toEqual(teacherResponse);
    });
  });
});
