import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  CreateUserDto,
  Profile,
  SetAdminDto,
  UserLevel,
} from './dto/create-user.dto';

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
            create: jest.fn(),
            setAdmin: jest.fn(),
            setSuperAdmin: jest.fn(),
            activateProfessor: jest.fn(),
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

  describe('create', () => {
    it('should create a new user and return the result', async () => {
      const createUserDto: CreateUserDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'Password@1234',
        registrationNumber: '2021001',
        photoFilePath: 'user-photo-url',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
      };

      const userResponse = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        registrationNumber: '2021001',
        photoFilePath: 'user-photo-url',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'create').mockResolvedValue(userResponse);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(userResponse);
    });
  });

  describe('set-admin', () => {
    it('should set an user as admin and return the result', async () => {
      const setAdminDto: SetAdminDto = {
        requestUserId: 'c73c2c5a-b6ee-4d8e-a47a-5c159728f2ea',
        targetUserId: '6047cb57-db11-4dc4-a305-33b86723dd09',
      };

      const setAdminResponse = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        photoFilePath: 'user-photo-url',
        profile: Profile.Professor,
        level: UserLevel.Admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'setAdmin').mockResolvedValue(setAdminResponse);

      const result = await controller.setAdmin(setAdminDto);

      expect(userService.setAdmin).toHaveBeenCalledWith(setAdminDto);
      expect(result).toEqual(setAdminResponse);
    });
  });

  describe('set-super-admin', () => {
    it('should set an user as super admin and return the result', async () => {
      const setAdminDto: SetAdminDto = {
        requestUserId: 'c73c2c5a-b6ee-4d8e-a47a-5c159728f2ea',
        targetUserId: '6047cb57-db11-4dc4-a305-33b86723dd09',
      };

      const setSuperAdminResponse = {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        photoFilePath: 'user-photo-url',
        profile: Profile.Professor,
        level: UserLevel.Admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(userService, 'setSuperAdmin')
        .mockResolvedValue(setSuperAdminResponse);

      const result = await controller.setSuperAdmin(setAdminDto);

      expect(userService.setSuperAdmin).toHaveBeenCalledWith(setAdminDto);
      expect(result).toEqual(setSuperAdminResponse);
    });
  });

  describe('activateUser', () => {
    it('should activate a user and return the result', async () => {
      // Arrange
      const userId = '1234';
      const expectedResponse = {
        id: '1234',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123',
        registrationNumber: 'REG12345',
        photoFilePath: 'photo/url/path',
        profile: Profile.Professor,
        level: UserLevel.Admin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest
        .spyOn(userService, 'activateProfessor')
        .mockResolvedValue(expectedResponse);

      const result = await controller.activateUser(userId);

      expect(userService.activateProfessor).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResponse);
    });
  });

});
