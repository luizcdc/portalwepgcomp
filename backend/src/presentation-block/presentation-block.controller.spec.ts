import { Test, TestingModule } from '@nestjs/testing';
import { PresentationBlockController } from './presentation-block.controller';
import { PresentationBlockService } from './presentation-block.service';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { ResponsePresentationBlockDto } from './dto/response-presentation-block.dto';

describe('PresentationBlockController', () => {
  let controller: PresentationBlockController;
  let service: PresentationBlockService;

  const mockPresentationBlockService = {
    create: jest.fn(),
    findAllByEventEditionId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresentationBlockController],
      providers: [
        {
          provide: PresentationBlockService,
          useValue: mockPresentationBlockService,
        },
      ],
    }).compile();

    controller = module.get<PresentationBlockController>(
      PresentationBlockController,
    );
    service = module.get<PresentationBlockService>(PresentationBlockService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a presentation block', async () => {
      const dto = new CreatePresentationBlockDto();
      const expectedResult = { id: '1', ...dto };

      mockPresentationBlockService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(dto);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllByEventEditionId', () => {
    it('should return an array of presentation blocks', async () => {
      const eventEditionId = '123';
      const mockPresentations = [
        { id: '1', title: 'Test 1' },
        { id: '2', title: 'Test 2' },
      ];

      mockPresentationBlockService.findAllByEventEditionId.mockResolvedValue(
        mockPresentations,
      );

      const result = await controller.findAllByEventEditionId(eventEditionId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(ResponsePresentationBlockDto);
      expect(service.findAllByEventEditionId).toHaveBeenCalledWith(
        eventEditionId,
      );
    });
  });

  describe('findOne', () => {
    it('should return a presentation block when found', async () => {
      const id = '1';
      const mockPresentation = { id, title: 'Test' };

      mockPresentationBlockService.findOne.mockResolvedValue(mockPresentation);

      const result = await controller.findOne(id);

      expect(result).toBeInstanceOf(ResponsePresentationBlockDto);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should return undefined when not found', async () => {
      const id = '999';

      mockPresentationBlockService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(id);

      expect(result).toBeUndefined();
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a presentation block', async () => {
      const id = '1';
      const dto = new UpdatePresentationBlockDto();
      const expectedResult = { id, ...dto };

      mockPresentationBlockService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(id, dto);

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove a presentation block', async () => {
      const id = '1';
      const expectedResult = { id, deleted: true };

      mockPresentationBlockService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(id);

      expect(result).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
