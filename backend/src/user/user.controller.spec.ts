import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, Profile, UserLevel } from './dto/create-user.dto';

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
});
