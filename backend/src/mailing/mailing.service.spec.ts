import { Test, TestingModule } from '@nestjs/testing';
import { MailingService } from './mailing.service';
import { EventEditionService } from '../event-edition/event-edition.service';
import { CommitteeMemberService } from '../committee-member/committee-member.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { createTransport } from 'nodemailer';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(),
}));

describe('ContactService', () => {
  let service: MailingService;
  let mailerTransportMock: any;

  beforeEach(async () => {
    const mockEmailErrorService = {
      someMethod: jest.fn(),
    };
    const mockEmailServerLimitService = {
      someOtherMethod: jest.fn(),
    };
    const mockDeadQueueService = {
      yetAnotherMethod: jest.fn(),
    };
    mailerTransportMock = {
      sendMail: jest.fn(),
    };

    (createTransport as jest.Mock).mockImplementation(
      () => mailerTransportMock,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        EventEditionService,
        CommitteeMemberService,
        PrismaService,
        { provide: 'EMAIL_ERROR_SERVICE', useValue: mockEmailErrorService },
        {
          provide: 'EMAIL_SERVER_LIMIT_SERVICE',
          useValue: mockEmailServerLimitService,
        },
        { provide: 'DEAD_QUEUE_SERVICE', useValue: mockDeadQueueService },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UserService - sendEmailConfirmation', () => {
    it('should send a confirmation email with the correct parameters', async () => {
      const email = 'test@example.com';
      const token = 'validToken123';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.MAIL_USER = 'no-reply@example.com';

      const expectedUrl = `${process.env.FRONTEND_URL}/users/confirm-email?token=${token}`;
      const expectedSubject = 'Confirmação de Cadastro';
      const expectedHtml = `<p>Clique no link para confirmar seu cadastro: <a href="${expectedUrl}">${expectedUrl}</a></p>`;

      await service.sendEmailConfirmation(email, token);

      expect(mailerTransportMock.sendMail).toHaveBeenCalledTimes(1);
      expect(mailerTransportMock.sendMail).toHaveBeenCalledWith({
        from: process.env.MAIL_USER,
        to: email,
        subject: expectedSubject,
        html: expectedHtml,
      });
    });

    it('should throw an error if sendMail fails', async () => {
      const email = 'test@example.com';
      const token = 'validToken123';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.MAIL_USER = 'no-reply@example.com';

      const error = new Error('Failed to send email');
      jest.spyOn(mailerTransportMock, 'sendMail').mockRejectedValue(error);

      await expect(service.sendEmailConfirmation(email, token)).rejects.toThrow(
        error,
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      const email = 'test@example.com';
      const token = 'validToken123';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      process.env.MAIL_USER = 'no-reply@example.com';

      const unexpectedError = new AppException(
        'Unexpected error occurred',
        500,
      );
      jest
        .spyOn(mailerTransportMock, 'sendMail')
        .mockRejectedValue(unexpectedError);

      await expect(service.sendEmailConfirmation(email, token)).rejects.toThrow(
        AppException,
      );
    });
  });
});
