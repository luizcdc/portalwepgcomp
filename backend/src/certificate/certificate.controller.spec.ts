import { Test, TestingModule } from '@nestjs/testing';
import { CertificateController } from './certificate.controller';
import { CertificateService } from './certificate.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { Response } from 'express';

describe('CertificateController', () => {
  let controller: CertificateController;

  const mockCertificateService = {
    generateCertificateForUser: jest.fn(),
  };

  const mockResponse = () => {
    const res: Partial<Response> = {
      set: jest.fn(),
      send: jest.fn(),
    };
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CertificateController],
      providers: [
        {
          provide: CertificateService,
          useValue: mockCertificateService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserLevelGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CertificateController>(CertificateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('downloadCertificate', () => {
    it('should return a PDF as a response', async () => {
      const userMock = {
        id: 'cc59c311-6fb5-46dd-a648-121df2e55290',
        name: 'Doutorando Default 3',
      };
      const eventEditionMock = {
        id: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        name: 'Sample Event Edition',
      };
      const mockPdfBuffer = Buffer.from('PDF content');
      const mockReq = {
        user: { userId: userMock.id },
      };
      const mockRes = mockResponse();

      mockCertificateService.generateCertificateForUser.mockResolvedValueOnce(
        mockPdfBuffer,
      );

      await controller.downloadCertificate(
        mockReq,
        mockRes,
        eventEditionMock.id,
      );

      // Assertions
      expect(
        mockCertificateService.generateCertificateForUser,
      ).toHaveBeenCalledWith(userMock.id, eventEditionMock.id);
      expect(mockRes.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=certificate.pdf',
      });
      expect(mockRes.send).toHaveBeenCalledWith(mockPdfBuffer);
    });

    it('should throw an error if the service fails', async () => {
      const userMock = {
        id: 'cc59c311-6fb5-46dd-a648-121df2e55290',
        name: 'Doutorando Default 3',
      };
      const eventEditionMock = {
        id: 'b88d1588-168a-4b7e-b118-bd6c5f84c9b2',
        name: 'Sample Event Edition',
      };
      const mockReq = { user: { userId: userMock.id } };
      const mockRes = mockResponse();

      mockCertificateService.generateCertificateForUser.mockRejectedValueOnce(
        new Error('Service failed'),
      );

      // Assertions for the error
      await expect(
        controller.downloadCertificate(mockReq, mockRes, eventEditionMock.id),
      ).rejects.toThrow('Service failed');
      expect(
        mockCertificateService.generateCertificateForUser,
      ).toHaveBeenCalledWith(userMock.id, eventEditionMock.id);
    });
  });
});
