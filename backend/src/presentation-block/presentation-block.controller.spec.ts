import { Test, TestingModule } from '@nestjs/testing';
import { PresentationBlockController } from './presentation-block.controller';
import { PresentationBlockService } from './presentation-block.service';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { ResponsePresentationBlockDto } from './dto/response-presentation-block.dto';
import { PresentationBlockType } from '@prisma/client';
import { SwapPresentationsDto } from './dto/swap-presentations.dto';
import { AppException } from '../exceptions/app.exception';

describe('PresentationBlockController', () => {
  let controller: PresentationBlockController;
  let service: PresentationBlockService;

  const mockPresentationBlockService = {
    create: jest.fn(),
    findAllByEventEditionId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    swapPresentations: jest.fn(),
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
      const mockPresentationBlocks = [
        {
          id: '1',
          eventEditionId: eventEditionId,
          type: PresentationBlockType.Presentation,
          presentations: [],
          panelists: [],
        },
        {
          id: '2',
          eventEditionId: eventEditionId,
          type: PresentationBlockType.Presentation,
          presentations: [],
          panelists: [],
        },
      ];

      mockPresentationBlockService.findAllByEventEditionId.mockResolvedValue(
        mockPresentationBlocks,
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
      const mockPresentationBlock = {
        id,
        eventEditionId: '123',
        type: PresentationBlockType.Presentation,
        presentations: [],
        panelists: [],
      };

      mockPresentationBlockService.findOne.mockResolvedValue(
        mockPresentationBlock,
      );

      const result = await controller.findOne(id);

      expect(result).toBeInstanceOf(ResponsePresentationBlockDto);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });

    it('should return null when not found', async () => {
      const id = '999';
      // the service will raise an exception if the block is not found, not return null
      // let's mock it raising an exception
      mockPresentationBlockService.findOne.mockRejectedValue(
        new AppException('Presentation block not found', 404),
      );

      const result = await controller.findOne(id);

      expect(result).toBeNull();
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

  describe('swapPresentations', () => {
    it('should call the service with the correct parameters and return the result', async () => {
      const id = 'block1';
      const swapPresentationsDto: SwapPresentationsDto = {
        presentation1Id: 'presentation1',
        presentation2Id: 'presentation2',
      };

      const serviceResponse = {
        message: 'Apresentações trocadas com sucesso',
      };

      jest
        .spyOn(service, 'swapPresentations')
        .mockResolvedValueOnce(serviceResponse);

      const result = await controller.swapPresentations(
        id,
        swapPresentationsDto,
      );

      expect(service.swapPresentations).toHaveBeenCalledWith(
        id,
        swapPresentationsDto,
      );
      expect(result).toEqual(serviceResponse);
    });

    it('should throw an error if the service throws an exception', async () => {
      const id = 'block1';
      const swapPresentationsDto: SwapPresentationsDto = {
        presentation1Id: 'presentation1',
        presentation2Id: 'presentation2',
      };

      jest
        .spyOn(service, 'swapPresentations')
        .mockRejectedValueOnce(new Error('Internal Server Error'));

      await expect(
        controller.swapPresentations(id, swapPresentationsDto),
      ).rejects.toThrow('Internal Server Error');
      expect(service.swapPresentations).toHaveBeenCalledWith(
        id,
        swapPresentationsDto,
      );
    });
  });
});
