import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, Profile } from './dto/create-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { Prisma, PrismaClient, UserLevel } from '@prisma/client';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MailingService } from '../mailing/mailing.service';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;
  let jwtService: JwtService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mailingService: MailingService;

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
              update: jest.fn(),
              databaseHasProfessors: jest.fn(),
              setDefault: jest.fn(),
              setAdmin: jest.fn(),
              isAdmin: jest.fn(),
              setSuperAdmin: jest.fn(),
              delete: jest.fn(),
              findFirst: jest.fn(),
            },
            emailVerification: {
              findFirst: jest.fn(),
              update: jest.fn(),
              create: jest.fn(),
            },
            $transaction: jest.fn(async (callback) => {
              const prismaMock = {
                userAccount: {
                  update: jest.fn(), // Mock de update para userAccount
                },
                emailVerification: {
                  update: jest.fn(), // Mock de update para emailVerification
                },
              };
              return callback(prismaMock as unknown as Partial<PrismaService>);
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: MailingService,
          useValue: {
            sendEmailConfirmation: jest.fn(),
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    mailingService = module.get<MailingService>(MailingService);
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

    it('should throw an AppException if DoctoralStudent registration number is null', async () => {
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValueOnce(null);

      const createUserDto: CreateUserDto = {
        name: 'Jane',
        email: 'new@example.com',
        password: 'password123',
      };

      await expect(service.create(createUserDto)).rejects.toThrow(
        new AppException(
          'O número de matrícula é obrigatório para estudantes de doutorado e professores.',
          400,
        ),
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
          level: 'Default',
          isActive: true,
        },
      });
      expect(result).toBeInstanceOf(ResponseUserDto);
      expect(result.email).toEqual(createUserDto.email);
    });

    it('should create first professor as super admin', async () => {
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null); // Ensure user does not exist
      prismaService.userAccount.create = jest.fn().mockResolvedValue({
        id: '1',
        name: 'John',
        registrationNumber: '2021001',
        email: 'newuser@example.com',
        photoFilePath: null,
        profile: 'Professor',
        level: 'Superadmin', // Ensure level is Superadmin
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      service.checkProfessorShouldBeSuperAdmin = jest
        .fn()
        .mockResolvedValue(true); // Ensure this is set to true

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createUserDto: CreateUserDto = {
        name: 'John',
        email: 'newuser@example.com',
        registrationNumber: '2021001',
        password: 'password123',
        profile: Profile.Professor,
        isActive: true,
      };

      const result = await service.create(createUserDto);

      // Verify password was hashed
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      // Verify the user was created with the correct level
      expect(prismaService.userAccount.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
          level: 'Superadmin',
        },
      });

      // Ensure the result is as expected
      expect(result).toBeInstanceOf(ResponseUserDto);
      expect(result.email).toEqual(createUserDto.email);
    });

    it('should create second professor as regular user', async () => {
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null); // Ensure user does not exist
      prismaService.userAccount.create = jest.fn().mockResolvedValue({
        id: '1',
        name: 'John',
        registrationNumber: '2021001',
        email: 'newuser@example.com',
        photoFilePath: null,
        profile: 'Professor',
        level: 'Default', // Ensure level is Default
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      service.checkProfessorShouldBeSuperAdmin = jest
        .fn()
        .mockResolvedValue(false); // Ensure this is set to false

      const hashedPassword = 'hashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createUserDto: CreateUserDto = {
        name: 'Jane',
        email: 'newuser@example.com',
        registrationNumber: '2021001',
        password: 'password123',
        profile: Profile.Professor,
      };

      const result = await service.create(createUserDto);

      // Verify password was hashed
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);

      // Verify the user was created with the correct level
      expect(prismaService.userAccount.create).toHaveBeenCalledWith({
        data: {
          ...createUserDto,
          password: hashedPassword,
          level: 'Default',
          isActive: false,
        },
      });

      // Ensure the result is as expected
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

  describe('checkProfessorShouldBeSuperAdmin', () => {
    it('should return true if database has no professors', async () => {
      prismaService.userAccount.count = jest.fn().mockResolvedValue(0);

      const result = await service.checkProfessorShouldBeSuperAdmin();

      expect(prismaService.userAccount.count).toHaveBeenCalledWith({
        where: {
          profile: Profile.Professor,
        },
      });
      expect(result).toEqual(true);
    });

    it('should return false if database has professors', async () => {
      prismaService.userAccount.count = jest.fn().mockResolvedValue(1);

      const result = await service.checkProfessorShouldBeSuperAdmin();

      expect(prismaService.userAccount.count).toHaveBeenCalledWith({
        where: {
          profile: Profile.Professor,
        },
      });
      expect(result).toEqual(false);
    });
  });

  describe('setDefault', () => {
    it('should throw AppException if request user is not found', async () => {
      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(undefined);

      const setDefaultDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setDefault(setDefaultDto)).rejects.toThrow(
        new AppException('Usuário solicitante não encontrado.', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.requestUserId,
        },
      });
    });

    it('should throw AppException if request user is not admin', async () => {
      const requestUser = {
        level: UserLevel.Default,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);

      const setDefaultDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setDefault(setDefaultDto)).rejects.toThrow(
        new AppException(
          'O usuário não possui privilégios de administrador ou super administrador.',
          403,
        ),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.requestUserId,
        },
      });
    });

    it('should throw AppException if target user is not found', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValueOnce(requestUser)
        .mockResolvedValueOnce(undefined);

      const setDefaultDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setDefault(setDefaultDto)).rejects.toThrow(
        new AppException('Usuário-alvo não encontrado.', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.requestUserId,
        },
      });
      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.targetUserId,
        },
      });
    });

    it('should throw AppException if request user has lower access level than target user', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      const targetUser = {
        level: UserLevel.Superadmin,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValueOnce(requestUser)
        .mockResolvedValueOnce(targetUser);

      const setDefaultDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setDefault(setDefaultDto)).rejects.toThrow(
        new AppException(
          'Um usuário administrador não tem permissão para rebaixar um super administrador.',
          403,
        ),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.requestUserId,
        },
      });
      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.targetUserId,
        },
      });
    });

    it('should return target user as default', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      const targetUser = {
        id: '1',
        name: 'John',
        email: 'user@example.com',
        registrationNumber: '2021001',
        photoFilePath: null,
        profile: 'DoctoralStudent',
        level: 'Admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest
        .fn()
        .mockResolvedValue(targetUser);

      const setDefaultDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      const result = await service.setDefault(setDefaultDto);

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.requestUserId,
        },
      });
      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: {
          id: setDefaultDto.targetUserId,
        },
        data: {
          level: UserLevel.Default,
        },
      });

      expect(result).toEqual(targetUser as ResponseUserDto);
    });
  });

  describe('setAdmin', () => {
    it('should throw AppException if request user is not found', async () => {
      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(undefined);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setAdmin(setAdminDto)).rejects.toThrow(
        new AppException('Usuário não encontrado.', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw AppException if request user is not admin', async () => {
      const requestUser = {
        level: UserLevel.Default,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setAdmin(setAdminDto)).rejects.toThrow(
        new AppException(
          'O usuário não possui privilégios de administrador ou super administrador.',
          403,
        ),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw AppException if target user is not found', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Error message', {
          code: 'P2025',
          clientVersion: 'test',
        }),
      );

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setAdmin(setAdminDto)).rejects.toThrow(
        new AppException('Usuário-alvo não encontrado', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw Error if unmapped error is thrown on update', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };
      const errorMock = new Error('Error message');

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest.fn().mockRejectedValue(errorMock);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setAdmin(setAdminDto)).rejects.toThrow(
        new Error(`Error: ${errorMock.message}`),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should return target user as admin', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      const targetUser = {
        id: '1',
        name: 'John',
        email: 'user@example.com',
        registrationNumber: '2021001',
        photoFilePath: null,
        profile: 'DoctoralStudent',
        level: 'Admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest
        .fn()
        .mockResolvedValue(targetUser);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      const result = await service.setAdmin(setAdminDto);

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.targetUserId,
        },
        data: {
          level: UserLevel.Admin,
        },
      });

      expect(result).toEqual(targetUser as ResponseUserDto);
    });
  });

  describe('setSuperAdmin', () => {
    it('should throw AppException if request user is not found', async () => {
      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(undefined);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setSuperAdmin(setAdminDto)).rejects.toThrow(
        new AppException('Usuário não encontrado.', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw AppException if request user is not super admin', async () => {
      const requestUser = {
        level: UserLevel.Admin,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setSuperAdmin(setAdminDto)).rejects.toThrow(
        new AppException(
          'O usuário não possui privilégios de super administrador.',
          403,
        ),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw AppException if target user is not found', async () => {
      const requestUser = {
        level: UserLevel.Superadmin,
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Error message', {
          code: 'P2025',
          clientVersion: 'test',
        }),
      );

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setSuperAdmin(setAdminDto)).rejects.toThrow(
        new AppException('Usuário-alvo não encontrado', 404),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should throw Error if unmapped error is thrown on update', async () => {
      const requestUser = {
        level: UserLevel.Superadmin,
      };
      const errorMock = new Error('Error message');

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest.fn().mockRejectedValue(errorMock);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      await expect(service.setSuperAdmin(setAdminDto)).rejects.toThrow(
        new Error(`Error: ${errorMock.message}`),
      );

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
    });

    it('should return target user as super admin', async () => {
      const requestUser = {
        level: UserLevel.Superadmin,
      };

      const targetUser = {
        id: '1',
        name: 'John',
        email: 'user@example.com',
        registrationNumber: '2021001',
        photoFilePath: null,
        profile: 'DoctoralStudent',
        level: 'Superadmin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.userAccount.findFirst = jest
        .fn()
        .mockResolvedValue(requestUser);
      prismaService.userAccount.update = jest
        .fn()
        .mockResolvedValue(targetUser);

      const setAdminDto = {
        requestUserId: 'abc',
        targetUserId: 'def',
      };

      const result = await service.setSuperAdmin(setAdminDto);

      expect(prismaService.userAccount.findFirst).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.requestUserId,
        },
      });
      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: {
          id: setAdminDto.targetUserId,
        },
        data: {
          level: UserLevel.Superadmin,
        },
      });

      expect(result).toEqual(targetUser as ResponseUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user if the user exists', async () => {
      const userId = '123';
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue({
        id: userId,
        name: 'John Doe',
        email: 'johndoe@example.com',
      });
      prismaService.userAccount.delete = jest.fn().mockResolvedValue(undefined);

      const result = await service.remove(userId);

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.userAccount.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual({
        message: 'Cadastro de Usuário removido com sucesso.',
      });
    });

    it('should throw an AppException if the user does not exist', async () => {
      const userId = 'nonexistent-id';
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(
        new AppException('Usuário não encontrado.', 404),
      );

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(prismaService.userAccount.delete).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users when no filters are applied', async () => {
      const usersMock = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
          registrationNumber: 'REG123',
          photoFilePath: 'photo/path',
          profile: Profile.Professor,
          level: UserLevel.Admin,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
        },
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'hashedPassword',
          registrationNumber: 'REG456',
          photoFilePath: 'photo/path',
          profile: Profile.Listener,
          level: UserLevel.Default,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
        },
      ];

      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue(usersMock);

      const result = await service.findAll();

      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        where: {},
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          registrationNumber: true,
          photoFilePath: true,
          profile: true,
          level: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
        },
      });

      expect(result).toEqual(
        usersMock.map((user) => new ResponseUserDto(user)),
      );
    });

    it('should return users filtered by role', async () => {
      const usersMock = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
          registrationNumber: 'REG123',
          photoFilePath: 'photo/path',
          profile: Profile.Professor,
          level: UserLevel.Admin,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
        },
      ];

      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue(usersMock);

      const result = await service.findAll('Admin');

      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        where: { level: 'Admin' },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          registrationNumber: true,
          photoFilePath: true,
          profile: true,
          level: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
        },
      });

      expect(result).toEqual(
        usersMock.map((user) => new ResponseUserDto(user)),
      );
    });

    it('should return users filtered by profile', async () => {
      const usersMock = [
        {
          id: '2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'hashedPassword',
          registrationNumber: 'REG456',
          photoFilePath: 'photo/path',
          profile: Profile.Listener,
          level: UserLevel.Default,
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
        },
      ];

      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue(usersMock);

      const result = await service.findAll(undefined, 'Listener');

      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        where: { profile: 'Listener' },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          registrationNumber: true,
          photoFilePath: true,
          profile: true,
          level: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
        },
      });

      expect(result).toEqual(
        usersMock.map((user) => new ResponseUserDto(user)),
      );
    });

    it('should return users filtered by both role and profile', async () => {
      const usersMock = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedPassword',
          registrationNumber: 'REG123',
          photoFilePath: 'photo/path',
          profile: Profile.Professor,
          level: UserLevel.Admin,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          isVerified: false,
        },
      ];

      prismaService.userAccount.findMany = jest
        .fn()
        .mockResolvedValue(usersMock);

      const result = await service.findAll('Admin', 'Professor');

      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        where: { level: 'Admin', profile: 'Professor' },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          registrationNumber: true,
          photoFilePath: true,
          profile: true,
          level: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          isVerified: true,
        },
      });

      expect(result).toEqual(
        usersMock.map((user) => new ResponseUserDto(user)),
      );
    });
  });

  describe('UserService - confirmEmail', () => {
    it('should confirm the email successfully for a valid token', async () => {
      const token = 'valid-token';
      const mockId = 'user-id';
      const userMock = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        registrationNumber: 'REG123',
        photoFilePath: 'photo/path',
        profile: Profile.Professor,
        level: UserLevel.Admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
      };

      jest.spyOn(jwtService, 'verify').mockReturnValue({ id: mockId });
      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (callback) => {
          const prismaMock = {
            userAccount: {
              update: jest.fn().mockResolvedValue(userMock),
            },
            emailVerification: {
              update: jest.fn().mockResolvedValue({}),
            },
            $executeRaw: jest.fn(),
            $executeRawUnsafe: jest.fn(),
            $queryRaw: jest.fn(),
            $queryRawUnsafe: jest.fn(),
            $connect: jest.fn(),
            $disconnect: jest.fn(),
            $on: jest.fn(),
            $use: jest.fn(),
            $extends: jest.fn(),
          } as unknown as PrismaClient;

          return callback(prismaMock);
        });

      const result = await service.confirmEmail(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should throw an exception when the token is already used', async () => {
      const token = 'used-token';

      // Mocka o Prisma para simular que o token já foi utilizado

      const emailVerificationMock = {
        id: '1',
        userId: '1',
        emailVerificationToken: token,
        emailVerificationSentAt: new Date(),
        emailVerifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.emailVerification.findFirst = jest
        .fn()
        .mockResolvedValue(emailVerificationMock);

      // Executa o método e espera que ele lance a exceção
      await expect(service.confirmEmail(token)).rejects.toThrow(
        new AppException('Token já utilizado.', 400),
      );

      // Verifica se o Prisma foi chamado com os argumentos corretos
      expect(prismaService.emailVerification.findFirst).toHaveBeenCalledWith({
        where: {
          emailVerificationToken: token,
          emailVerifiedAt: {
            not: null,
          },
        },
      });
    });

    it('should throw AppException for an expired or invalid token', async () => {
      const token = 'expired-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new TokenExpiredError('Token expirado', new Date());
      });

      await expect(service.confirmEmail(token)).rejects.toThrow(
        new AppException('Token inválido ou expirado.', 400),
      );

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(prismaService.userAccount.update).not.toHaveBeenCalled();
    });

    it('should rethrow unexpected errors', async () => {
      const token = 'error-token';

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(service.confirmEmail(token)).rejects.toThrow(
        'Unexpected error',
      );

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(prismaService.userAccount.update).not.toHaveBeenCalled();
    });
  });

  describe('updateRegistrationNumber', () => {
    it('should update the registration number for an existing user', async () => {
      const userId = 'user-id-1';
      const newRegistrationNumber = 'PROF1234';
  
      // Mock do Prisma para simular a atualização do registro
      prismaService.userAccount.update = jest.fn().mockResolvedValue({
        id: userId,
        registrationNumber: newRegistrationNumber,
      });
  
      // Chamada do método
      await service.updateRegistrationNumber(userId, newRegistrationNumber);
  
      // Verificando se a função Prisma foi chamada corretamente
      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { registrationNumber: newRegistrationNumber },
      });
    });
  });
  
  it('should throw an error if user is not found', async () => {
    const userId = 'nonexistent-user-id';
    const newRegistrationNumber = 'PROF1234';
  
    // Mock do Prisma para simular que o usuário não foi encontrado
    prismaService.userAccount.update = jest.fn().mockRejectedValue(new Error('User not found'));
  
    // Esperando que uma exceção seja lançada
    await expect(
      service.updateRegistrationNumber(userId, newRegistrationNumber),
    ).rejects.toThrowError('User not found');
  
    // Verificando se o Prisma foi chamado corretamente
    expect(prismaService.userAccount.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { registrationNumber: newRegistrationNumber },
    });
  });

  it('should update the registration number to null', async () => {
    const userId = 'user-id-1';
    const registrationNumber = null; // Registro sendo setado para null
  
    // Mock do Prisma para simular a atualização
    prismaService.userAccount.update = jest.fn().mockResolvedValue({
      id: userId,
      registrationNumber,
    });
  
    // Chamada do método
    await service.updateRegistrationNumber(userId, registrationNumber);
  
    // Verificando se a função Prisma foi chamada corretamente
    expect(prismaService.userAccount.update).toHaveBeenCalledWith({
      where: { id: userId },
      data: { registrationNumber },
    });
  });  
});
