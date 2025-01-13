import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ForgotPasswordDto, ResetPasswordDto, SignInDto } from './auth.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = { token: 'mockToken', data: { id: '1', name: 'User' } };
      jest.spyOn(authService, 'signIn').mockResolvedValue(mockToken);

      const result = await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
      expect(result).toEqual(mockToken);
    });

    it('should throw an error if AuthService.signIn fails', async () => {
      const signInDto: SignInDto = {
        email: 'test@example.com',
        password: 'wrongPassword',
      };

      jest
        .spyOn(authService, 'signIn')
        .mockRejectedValue(new Error('Invalid credentials'));

      await expect(authController.signIn(signInDto)).rejects.toThrowError(
        'Invalid credentials',
      );
    });
  });

  describe('forgotPassword', () => {
    it('should call AuthService.forgotPassword with correct email', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };

      const mockResponse = {
        message: 'Token de redefinição de senha enviado.',
      };
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue(mockResponse);

      const result = await authController.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto.email,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if AuthService.forgotPassword fails', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };

      jest
        .spyOn(authService, 'forgotPassword')
        .mockRejectedValue(new Error('User not found'));

      await expect(
        authController.forgotPassword(forgotPasswordDto),
      ).rejects.toThrowError('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should call AuthService.resetPassword with correct parameters', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        newPassword: 'newPassword123',
      };
      const token = 'mockToken';

      const mockResponse = { message: 'Senha redefinida com sucesso.' };
      jest.spyOn(authService, 'resetPassword').mockResolvedValue(mockResponse);

      const result = await authController.resetPassword(
        token,
        resetPasswordDto,
      );

      expect(authService.resetPassword).toHaveBeenCalledWith(
        token,
        resetPasswordDto.newPassword,
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if token is invalid', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        newPassword: 'newPassword123',
      };
      const token = 'invalidToken';

      jest
        .spyOn(authService, 'resetPassword')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(
        authController.resetPassword(token, resetPasswordDto),
      ).rejects.toThrowError('Invalid token');
    });
  });
});
