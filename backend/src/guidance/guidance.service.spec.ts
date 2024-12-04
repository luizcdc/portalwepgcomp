import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceService } from './guidance.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { ResponseGuidanceDto } from './dto/response-guidance.dto';

describe('GuidanceService', () => {
  let service: GuidanceService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuidanceService,
        {
          provide: PrismaService,
          useValue: {
            guidance: {
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GuidanceService>(GuidanceService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getUniqueInstance', () => {
    it('should return existing guidance when instance exists', async () => {
      const mockExistingGuidance = {
        id: '1',
        summary: 'Existing Summary',
        authorGuidance: 'Author Guidance',
        reviewerGuidance: 'Reviewer Guidance',
        audienceGuidance: 'Audience Guidance',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.guidance.findFirst as jest.Mock).mockResolvedValue(
        mockExistingGuidance,
      );

      const result = await service.getUniqueInstance();

      expect(prismaService.guidance.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          summary: 'Existing Summary',
        }),
      );
    });

    it('should create new guidance when no instance exists', async () => {
      const mockNewGuidance = {
        id: '1',
        summary: '',
        authorGuidance: '',
        reviewerGuidance: '',
        audienceGuidance: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.guidance.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.guidance.create as jest.Mock).mockResolvedValue(
        mockNewGuidance,
      );

      const result = await service.getUniqueInstance();

      expect(prismaService.guidance.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaService.guidance.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(
        expect.objectContaining({
          id: '1',
          summary: '',
        }),
      );
    });
  });

  describe('update', () => {
    it('should update existing guidance', async () => {
      const mockExistingGuidance = {
        id: '1',
        summary: 'Existing Summary',
        authorGuidance: 'Author Guidance',
        reviewerGuidance: 'Reviewer Guidance',
        audienceGuidance: 'Audience Guidance',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateDto: UpdateGuidanceDto = {
        summary: 'Updated Summary',
      };

      const mockUpdatedGuidance = {
        ...mockExistingGuidance,
        ...updateDto,
        updatedAt: new Date(),
      };

      jest
        .spyOn(service, 'getUniqueInstance')
        .mockResolvedValue(new ResponseGuidanceDto(mockExistingGuidance));
      (prismaService.guidance.update as jest.Mock).mockResolvedValue(
        mockUpdatedGuidance,
      );

      const result = await service.update(updateDto);

      expect(service.getUniqueInstance).toHaveBeenCalledTimes(1);
      expect(prismaService.guidance.update).toHaveBeenCalledWith({
        where: { id: mockExistingGuidance.id },
        data: updateDto,
      });
      expect(result).toEqual(mockUpdatedGuidance);
    });
  });
});
