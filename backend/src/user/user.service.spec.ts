import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

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
            userAccount: {
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

  describe('create', () => {
    it('should throw an AppException if email already exists', async () => {
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(true);

      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'existing@example.com',
        password: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new AppException('Um usuário com esse email já existe.', 400),
      );
    });

    it('should throw an AppException if registration number already exists', async () => {
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(true);

      const createUserDto: CreateUserDto = {
        name: 'Jane',
        email: 'new@example.com',
        password: 'password123',
        registrationNumber: '2021001',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new AppException('Um usuário com essa matrícula já existe.', 400),
      );
    });

    it('should hash password and create a new user', async () => {
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null);
      prismaService.userAccount.create = jest.fn().mockResolvedValue({
        id: '1',
        name: 'John',
        email: 'newuser@example.com',
        registrationNumber: '2021001',
        photoFilePath: null,
        profile: 'DoctoralStudent',
        level: 'Default',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'newuser@example.com',
        password: 'password123',
        registrationNumber: '2021001',
      };

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prismaService.userAccount.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });
      expect(result).toBeInstanceOf(ResponseUserDto);
      expect(result.email).toEqual(createUserDto.email);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const userMock = {
        id: '1',
        name: 'John',
        email: 'user@example.com',
        registrationNumber: '2021001',
        photoFilePath: null,
        profile: 'DoctoralStudent',
        level: 'Default',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValue(userMock);

      const result = await service.findByEmail('user@example.com');

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@example.com' },
      });
      expect(result).toEqual(userMock);
    });

    it('should return null if user does not exist', async () => {
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });
});
