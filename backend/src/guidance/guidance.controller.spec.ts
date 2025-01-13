import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceController } from './guidance.controller';
import { GuidanceService } from './guidance.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';

describe('GuidanceController', () => {
  let controller: GuidanceController;
  let guidanceServiceMock: Partial<GuidanceService>;

  beforeEach(async () => {
    // Mock do GuidanceService
    guidanceServiceMock = {
      getActiveInstance: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuidanceController],
      providers: [
        {
          provide: GuidanceService,
          useValue: guidanceServiceMock,
        },
      ],
    }).compile();

    controller = module.get<GuidanceController>(GuidanceController);
  });

  describe('getGuidance', () => {
    it('should return guidance instance', async () => {
      const mockGuidance = {
        id: '1',
        summary: 'Test Summary',
        authorGuidance: 'Author Guidance',
        reviewerGuidance: 'Reviewer Guidance',
        audienceGuidance: 'Audience Guidance',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (guidanceServiceMock.getActiveInstance as jest.Mock).mockResolvedValue(
        mockGuidance,
      );

      const result = await controller.getGuidance();

      expect(guidanceServiceMock.getActiveInstance).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockGuidance);
    });
  });

  describe('updateGuidance', () => {
    it('should update guidance', async () => {
      const updateDto: UpdateGuidanceDto = {
        summary: 'Updated Summary',
      };

      const mockUpdatedGuidance = {
        id: '1',
        summary: 'Updated Summary',
        authorGuidance: 'Author Guidance',
        reviewerGuidance: 'Reviewer Guidance',
        audienceGuidance: 'Audience Guidance',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (guidanceServiceMock.update as jest.Mock).mockResolvedValue(
        mockUpdatedGuidance,
      );

      const result = await controller.updateGuidance('1', updateDto);

      expect(guidanceServiceMock.update).toHaveBeenCalledWith('1', updateDto);
      expect(result).toEqual(mockUpdatedGuidance);
    });

    it('should call update with correct DTO', async () => {
      const updateDto: UpdateGuidanceDto = {
        summary: 'Another Update',
        authorGuidance: 'New Author Guidance',
      };

      (guidanceServiceMock.update as jest.Mock).mockResolvedValue({} as any);

      await controller.updateGuidance('1', updateDto);

      expect(guidanceServiceMock.update).toHaveBeenCalledWith('1', updateDto);
    });
  });
});
