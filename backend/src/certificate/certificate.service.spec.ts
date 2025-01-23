import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from './certificate.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailingService } from '../mailing/mailing.service';
import { AppException } from '../exceptions/app.exception';

describe('CertificateService', () => {
  let service: CertificateService;
  let prismaService: PrismaService;
  let mailingService: MailingService;

  const mockPrismaService = {
    eventEdition: {
      findMany: jest.fn(),
    },
    userAccount: {
      findMany: jest.fn(),
    },
  };

  const mockMailingService = {
    sendEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CertificateService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: MailingService,
          useValue: mockMailingService,
        },
      ],
    }).compile();

    service = module.get<CertificateService>(CertificateService);
    prismaService = module.get<PrismaService>(PrismaService);
    mailingService = module.get<MailingService>(MailingService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCron', () => {
    it('should process eligible users and send emails', async () => {
      const mockEvents = [
        {
          id: 1,
          isActive: true,
          endDate: new Date(),
        },
      ];
      const mockUsers = [
        {
          id: 1,
          name: 'Eligible User',
          email: 'eligible@example.com',
          profile: 'Professor',
          panelistParticipations: [{ id: 1 }],
          mainAuthored: [],
          panelistAwards: [],
          certificates: [],
        },
      ];

      mockPrismaService.eventEdition.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userAccount.findMany.mockResolvedValue(mockUsers);

      jest
        .spyOn(service, 'validateUserEligibility')
        .mockImplementation(() => {});

      await service.handleCron();

      expect(prismaService.eventEdition.findMany).toHaveBeenCalled();
      expect(prismaService.userAccount.findMany).toHaveBeenCalledWith({
        include: {
          panelistParticipations: {
            where: { presentationBlock: { eventEditionId: mockEvents[0].id } },
          },
          mainAuthored: { where: { eventEditionId: mockEvents[0].id } },
          panelistAwards: { where: { eventEditionId: mockEvents[0].id } },
          certificates: { where: { eventEditionId: mockEvents[0].id } },
        },
      });
      expect(service.validateUserEligibility).toHaveBeenCalledWith(
        mockUsers[0],
        mockEvents[0],
      );
      expect(mailingService.sendEmail).toHaveBeenCalledWith({
        from: `"${mockUsers[0].name}" <${mockUsers[0].email}>`,
        to: mockUsers[0].email,
        subject: 'Certificado',
        text: 'Seu certificado já está pronto para ser baixado na página do WEPGCOMP!',
      });
    });

    it('should skip users who are not eligible', async () => {
      const mockEvents = [
        {
          id: 1,
          isActive: true,
          endDate: new Date(),
        },
      ];
      const mockUsers = [
        {
          id: 2,
          name: 'Ineligible User',
          email: 'ineligible@example.com',
          profile: 'Listener',
          panelistParticipations: [],
          mainAuthored: [],
          panelistAwards: [],
          certificates: [],
        },
      ];

      mockPrismaService.eventEdition.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userAccount.findMany.mockResolvedValue(mockUsers);

      jest.spyOn(service, 'validateUserEligibility').mockImplementation(() => {
        throw new AppException('Usuário não elegível', 400);
      });

      await service.handleCron();

      expect(service.validateUserEligibility).toHaveBeenCalledWith(
        mockUsers[0],
        mockEvents[0],
      );
      expect(mailingService.sendEmail).not.toHaveBeenCalled();
    });

    it('should handle exceptions gracefully', async () => {
      mockPrismaService.eventEdition.findMany.mockImplementation(() => {
        throw new Error('Database Error');
      });

      await expect(service.handleCron()).rejects.toThrow('Database Error');

      expect(mockPrismaService.eventEdition.findMany).toHaveBeenCalled();
      expect(mailingService.sendEmail).not.toHaveBeenCalled();
    });

    it('should handle empty events gracefully', async () => {
      mockPrismaService.eventEdition.findMany.mockResolvedValue([]);

      await service.handleCron();

      expect(prismaService.eventEdition.findMany).toHaveBeenCalled();
      expect(prismaService.userAccount.findMany).not.toHaveBeenCalled();
      expect(mailingService.sendEmail).not.toHaveBeenCalled();
    });

    it('should process multiple eligible users and send emails', async () => {
      const mockEvents = [
        {
          id: 1,
          isActive: true,
          endDate: new Date(),
        },
      ];
      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          email: 'user1@example.com',
          profile: 'Professor',
          panelistParticipations: [{ id: 1 }],
          mainAuthored: [],
          panelistAwards: [],
          certificates: [],
        },
        {
          id: 2,
          name: 'User 2',
          email: 'user2@example.com',
          profile: 'DoctoralStudent',
          panelistParticipations: [],
          mainAuthored: [{ id: 1 }],
          panelistAwards: [],
          certificates: [],
        },
      ];

      mockPrismaService.eventEdition.findMany.mockResolvedValue(mockEvents);
      mockPrismaService.userAccount.findMany.mockResolvedValue(mockUsers);

      jest
        .spyOn(service, 'validateUserEligibility')
        .mockImplementation(() => {});

      await service.handleCron();

      expect(service.validateUserEligibility).toHaveBeenCalledTimes(2);
      expect(mailingService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });
});
