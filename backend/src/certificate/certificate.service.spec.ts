import { Test, TestingModule } from '@nestjs/testing';
import { CertificateService } from './certificate.service';
import { PrismaService } from '../prisma/prisma.service';
import { Profile, UserLevel, PresentationStatus } from '@prisma/client';
import * as fontkit from '@pdf-lib/fontkit';
import { PDFDocument } from 'pdf-lib';
import { AppException } from '../exceptions/app.exception';
import { MailingService } from '../mailing/mailing.service';

jest.mock('pdf-lib', () => {
  const actualPdfLib = jest.requireActual('pdf-lib');

  const mockFont = {
    widthOfTextAtSize: jest.fn().mockReturnValue(100),
  };

  const mockPDFDocument = {
    embedFont: jest.fn().mockResolvedValue(mockFont),
    save: jest.fn().mockResolvedValue(Buffer.from('mocked-pdf')),
    registerFontkit: jest.fn(),
    setTitle: jest.fn(),
    setSubject: jest.fn(),
    setAuthor: jest.fn(),
    setProducer: jest.fn(),
    setCreator: jest.fn(),
    addPage: jest.fn((dimensions) => ({
      getWidth: () => dimensions[0],
      getHeight: () => dimensions[1],
      drawText: jest.fn(),
      drawImage: jest.fn(),
      drawLine: jest.fn(),
    })),
    embedPng: jest.fn().mockResolvedValue({
      width: 100,
      height: 100,
      scale: jest.fn().mockReturnValue({ width: 50, height: 50 }),
    }),
  };

  return {
    ...actualPdfLib,
    PDFDocument: {
      ...actualPdfLib.PDFDocument,
      create: jest.fn().mockResolvedValue(mockPDFDocument),
    },
  };
});

describe('CertificateService', () => {
  let service: CertificateService;
  let prismaService: PrismaService;
  let mailingService: MailingService;

  const mockPrismaService = {
    userAccount: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    eventEdition: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    presentation: {
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

  describe('generateCertificateForUser', () => {
    it('should generate a certificate PDF for the user', async () => {
      const userMock = {
        id: 'cc59c311-6fb5-46dd-a648-121df2e55290',
        name: 'Doutorando Default 3',
        email: 'docdefault3@example.com',
        password:
          '$2b$10$kwFkaLgZTaeM/7KNz5EE0Og.2CDlFC8m96o5ZbzlSfVJ.5kqUT3L2',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        mainAuthored: [{ title: 'Sample Title' }],
        panelistAwards: [],
        certificates: [],
      };

      const eventEditionMock = {
        id: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        name: 'Sample Event Edition',
        description: 'This is a description of the event edition.',
        callForPapersText: 'Call for papers details...',
        partnersText: 'Partners information...',
        location: 'Conference Hall 1',
        startDate: new Date('2025-01-01T10:00:00Z'),
        endDate: new Date('2025-01-03T18:00:00Z'),
        submissionStartDate: new Date('2025-01-01T00:00:00Z'),
        submissionDeadline: new Date('2025-01-15T23:59:59Z'),
        isEvaluationRestrictToLoggedUsers: true,
        presentationDuration: 30, // in minutes
        presentationsPerPresentationBlock: 5,
        coordinatorId: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        isActive: true,
        createdAt: new Date('2024-12-01T10:00:00Z'),
        updatedAt: new Date('2024-12-01T10:00:00Z'),
      };

      const presentationsMock = [
        {
          id: '1',
          submissionId: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
          presentationBlockId: 'a1234567-1234-5678-1234-567812345678',
          positionWithinBlock: 1,
          status: PresentationStatus.ToPresent,
          createdAt: new Date('2025-01-01T00:00:00Z'),
          updatedAt: new Date('2025-01-01T00:00:00Z'),
          publicAverageScore: 0,
          evaluatorsAverageScore: 0,
        },
        {
          id: '2',
          submissionId: 'c99d1588-168a-4b7e-b118-bd6c5f84c9b3',
          presentationBlockId: 'a1234567-1234-5678-1234-567812345679',
          positionWithinBlock: 2,
          status: PresentationStatus.Presented,
          createdAt: new Date('2025-01-02T00:00:00Z'),
          updatedAt: new Date('2025-01-02T00:00:00Z'),
          publicAverageScore: 5,
          evaluatorsAverageScore: 4,
        },
        {
          id: '3',
          submissionId: 'd88d1588-168a-4b7e-b118-bd6c5f84c9b4',
          presentationBlockId: 'a1234567-1234-5678-1234-567812345680',
          positionWithinBlock: 0,
          status: PresentationStatus.NotPresented,
          createdAt: new Date('2025-01-03T00:00:00Z'),
          updatedAt: new Date('2025-01-03T00:00:00Z'),
          publicAverageScore: 0,
          evaluatorsAverageScore: 0,
        },
      ];

      jest
        .mocked(prismaService.userAccount.findUnique)
        .mockResolvedValue(userMock);
      jest
        .mocked(prismaService.eventEdition.findUnique)
        .mockResolvedValue(eventEditionMock);
      jest
        .mocked(prismaService.presentation.findMany)
        .mockResolvedValue(presentationsMock);

      jest.mocked(prismaService.userAccount.findFirst).mockResolvedValue({
        id: '28e4d7a0-c005-4397-93cc-69f74065bcbc',
        name: 'Professor Superadmin',
        email: 'profsuperadmin@example.com',
        password:
          '$2b$10$ezvAid85jjfWat5xm240Qe3cpY.5KE2B.yp3CDxdHF3Ghuloz6omK',
        registrationNumber: '123456',
        photoFilePath: null,
        profile: Profile.Professor,
        level: UserLevel.Superadmin,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
      });

      const result = await service.generateCertificateForUser(
        userMock.id,
        eventEditionMock.id,
      );

      expect(result).toBeInstanceOf(Buffer);

      const mockPDF = await PDFDocument.create();

      mockPDF.registerFontkit(fontkit);

      expect(mockPDF.registerFontkit).toHaveBeenCalledWith(fontkit);

      expect(mockPDF.embedFont).toHaveBeenCalled();

      expect(mockPDF.addPage).toHaveBeenCalledWith(
        expect.arrayContaining([595.28, 841.89]),
      );
    });

    it('should throw AppException if user didnt participate in panelist sessions', async () => {
      const userMock = {
        id: 'f7d599b6-3c87-4ccf-a144-49725cd1ab1e',
        name: 'Professor Default 3',
        email: 'profdefault3@example.com',
        password:
          '$2b$10$JILhHH/UXJ9ixXDGdfGbpOsJCG4QS9V4wxbIE0Z8ncUt8NmIS2gzW',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.Professor,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        mainAuthored: [{ title: 'Sample Title' }],
        panelistAwards: [],
        panelistParticipations: [],
        certificates: [],
      };

      const eventEditionMock = {
        id: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        name: 'Sample Event Edition',
        description: 'This is a description of the event edition.',
        callForPapersText: 'Call for papers details...',
        partnersText: 'Partners information...',
        location: 'Conference Hall 1',
        startDate: new Date('2025-01-01T10:00:00Z'),
        endDate: new Date('2025-01-03T18:00:00Z'),
        submissionStartDate: new Date('2025-01-01T00:00:00Z'),
        submissionDeadline: new Date('2025-01-15T23:59:59Z'),
        isEvaluationRestrictToLoggedUsers: true,
        presentationDuration: 30,
        presentationsPerPresentationBlock: 5,
        coordinatorId: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        isActive: true,
        createdAt: new Date('2024-12-01T10:00:00Z'),
        updatedAt: new Date('2024-12-01T10:00:00Z'),
      };

      await expect(
        service.validateUserEligibility(userMock, eventEditionMock),
      ).rejects.toThrow(AppException);

      await expect(
        service.validateUserEligibility(userMock, eventEditionMock),
      ).rejects.toThrow(
        'Professor não participou de mesas avaliadoras, portanto não pode receber certificado',
      );
    });

    it('should call metadata methods', async () => {
      const mockPDF = await PDFDocument.create();

      expect(mockPDF.setTitle).toHaveBeenCalledWith(
        expect.stringContaining('Certificado'),
      );
      expect(mockPDF.setSubject).toHaveBeenCalled();
      expect(mockPDF.setProducer).toHaveBeenCalled();
      expect(mockPDF.setCreator).toHaveBeenCalled();
      expect(mockPDF.setAuthor).toHaveBeenCalled();
    });
  });

  describe('handleCron', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

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
        .mockImplementation(async () => {});
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
        .mockImplementation(async () => {});
      await service.handleCron();
      expect(service.validateUserEligibility).toHaveBeenCalledTimes(2);
      expect(mailingService.sendEmail).toHaveBeenCalledTimes(2);
    });
  });
});
