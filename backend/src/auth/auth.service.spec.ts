import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { MailingService } from '../mailing/mailing.service';
import * as bcrypt from 'bcrypt';
import { AppException } from '../exceptions/app.exception';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Profile, UserLevel } from '../user/dto/create-user.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let mailingService: MailingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            userAccount: {
              update: jest.fn(),
            },
          },
        },
        {
          provide: MailingService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailingService = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return user data if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        profile: 'DoctoralStudent',
        isActive: true,
        level: 'Default',
        password: 'hashedPassword', // Simulated hashed password
      };
    
      // Mock dependencies
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(async (password, hashedPassword) => {
        return password === 'password' && hashedPassword === 'hashedPassword'; // Simulate bcrypt.compare behavior
      });
    
      // Call the service method
      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password',
      });
    
      // Assertions
      expect(result.data).toEqual({
        id: '1',
        name: 'Test User',
        profile: 'DoctoralStudent',
        isActive: true,
        level: 'Default',
      });
    
      // Verify mocks were called
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword'); // Ensure the proper arguments are passed
    });    
    

    it('should throw an exception if credentials are invalid', async () => {
      const mockUser = {
        name: 'Test User',
        id: '1', // Alterado para string
        email: 'test@example.com',
        password: 'hashed',
        registrationNumber: '123456',
        photoFilePath: '/path/to/photo',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.signIn({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(AppException);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'password',
        mockUser.password,
      );
    });

    it('should throw an exception if user is not found', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(undefined);

      await expect(
        authService.signIn({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(AppException);
    });
  });

  describe('forgotPassword', () => {
    it('should send a reset password email if user exists', async () => {
      const mockUser = {
        name: 'Test User',
        id: '1', // Alterado para string
        email: 'test@example.com',
        password: 'hashed',
        registrationNumber: '123456',
        photoFilePath: '/path/to/photo',
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockToken = 'mockResetToken';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await authService.forgotPassword('test@example.com');

      expect(result).toEqual({
        message: 'Token de redefinição de senha enviado.',
      });
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(jwtService.sign).toHaveBeenCalledWith(
        { userId: mockUser.id },
        { expiresIn: '1h' },
      );
      expect(mailingService.sendEmail).toHaveBeenCalledWith({
        from: `"${mockUser.name}" <${mockUser.email}>`,
        to: mockUser.email,
        subject: 'Redefinição de senha: WEPGCOMP',
        text: `Link para redefinição de senha: ${process.env.FRONTEND_URL}/AlterarSenha/${mockToken}`,
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.forgotPassword('nonexistent@example.com'),
      ).rejects.toThrow(NotFoundException);

      expect(userService.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset the password if the token is valid', async () => {
      const mockPayload = { userId: '1' };
      const hashedPassword = 'hashedPassword';

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.userAccount, 'update').mockResolvedValue(null);

      const result = await authService.resetPassword(
        'validToken',
        'newPassword',
      );

      expect(result).toEqual({ message: 'Senha redefinida com sucesso.' });
      expect(jwtService.verify).toHaveBeenCalledWith('validToken');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: { id: mockPayload.userId },
        data: { password: hashedPassword },
      });
    });

    it('should throw BadRequestException if the token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(
        authService.resetPassword('invalidToken', 'newPassword'),
      ).rejects.toThrow(BadRequestException);

      expect(jwtService.verify).toHaveBeenCalledWith('invalidToken');
    });
  });
});
