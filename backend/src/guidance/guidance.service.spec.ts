import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceService } from './guidance.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { EventEditionService } from '../event-edition/event-edition.service';
import { AppException } from '../exceptions/app.exception';
import { CreateGuidanceDto } from './dto/create-guidance.dto';
import { ResponseGuidanceDto } from './dto/response-guidance.dto';

describe('GuidanceService', () => {
  let service: GuidanceService;
  let prismaService: PrismaService;
  let eventEditionService: EventEditionService;

  const mockActiveEventEdition = {
    id: 'event-edition-1',
    name: 'Edição Ativa',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuidanceService,
        {
          provide: EventEditionService,
          useValue: {
            findActive: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            guidance: {
              findFirst: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GuidanceService>(GuidanceService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEditionService = module.get<EventEditionService>(EventEditionService);
  });

  describe('getActiveInstance', () => {
    it('should return existing guidance when instance exists', async () => {
      const mockExistingGuidance = {
        id: 'guidance-1',
        summary: 'Nova Orientação',
        authorGuidance: 'Descrição da nova orientação',
        reviewerGuidance: 'Descrição da nova orientação',
        audienceGuidance: 'Descrição da nova orientação',
        eventEditionId: mockActiveEventEdition.id,
        createdAt: new Date('2021-07-01T00:00:00.000Z'),
        updatedAt: new Date('2021-07-01T00:00:00.000Z'),
      };

      (eventEditionService.findActive as jest.Mock).mockResolvedValue(
        mockActiveEventEdition,
      );
      (prismaService.guidance.findFirst as jest.Mock).mockResolvedValue(
        mockExistingGuidance,
      );

      const result = await service.getActiveInstance();

      expect(eventEditionService.findActive).toHaveBeenCalledTimes(1);
      expect(prismaService.guidance.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(ResponseGuidanceDto);
      expect(result.id).toBe('guidance-1');
      expect(result.summary).toBe('Nova Orientação');
    });

    it('should throw an exception when no active guidance exists', async () => {
      (eventEditionService.findActive as jest.Mock).mockResolvedValue(
        mockActiveEventEdition,
      );
      (prismaService.guidance.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.getActiveInstance()).rejects.toThrow(
        new AppException(
          'Não existe orientação ativa para a edição do evento.',
          404,
        ),
      );
    });
  });

  describe('update', () => {
    it('should update existing guidance', async () => {
      const mockExistingGuidance = {
        id: 'guidance-1',
        summary: 'Orientação Existente',
        authorGuidance: 'Descrição da Orientação',
        reviewerGuidance: 'Descrição da Orientação',
        audienceGuidance: 'Descrição da Orientação',
        eventEditionId: mockActiveEventEdition.id,
        createdAt: new Date('2021-07-01T00:00:00.000Z'),
        updatedAt: new Date('2021-07-01T00:00:00.000Z'),
      };

      const updateDto: UpdateGuidanceDto = {
        summary: 'Orientação Atualizada',
        authorGuidance: 'Descrição da Orientação Atualizada',
        reviewerGuidance: 'Descrição da Orientação Atualizada',
        audienceGuidance: 'Descrição da Orientação Atualizada',
        updatedAt: new Date('2021-07-02T00:00:00.000Z'),
      };

      const mockUpdatedGuidance = {
        ...mockExistingGuidance,
        ...updateDto,
        updatedAt: new Date('2021-07-02T00:00:00.000Z'),
      };

      // Mock getActiveInstance to return the existing guidance
      jest
        .spyOn(service, 'getActiveInstance')
        .mockResolvedValue(mockExistingGuidance as ResponseGuidanceDto);

      (prismaService.guidance.update as jest.Mock).mockResolvedValue(
        mockUpdatedGuidance,
      );

      const result = await service.update(updateDto);

      expect(service.getActiveInstance).toHaveBeenCalledTimes(1);
      expect(prismaService.guidance.update).toHaveBeenCalledWith({
        where: { id: mockExistingGuidance.id }, // Corrected from mockActiveEventEdition.id
        data: updateDto,
      });
      expect(result).toEqual(mockUpdatedGuidance);
    });
  });

  describe('create', () => {
    it('should successfully create a new guidance', async () => {
      const createDto: CreateGuidanceDto = {
        summary: 'Nova Orientação',
        authorGuidance: 'Descrição da nova orientação',
        reviewerGuidance: 'Descrição da nova orientação',
        audienceGuidance: 'Descrição da nova orientação',
        eventEditionId: mockActiveEventEdition.id,
        createdAt: new Date('2021-07-01T00:00:00.000Z'),
        updatedAt: new Date('2021-07-01T00:00:00.000Z'),
      };

      const mockCreatedGuidance = {
        id: 'guidance-1',
        ...createDto,
        eventEditionId: mockActiveEventEdition.id,
      };

      // Mock the findActive method of EventEditionService
      (eventEditionService.findActive as jest.Mock).mockResolvedValue(
        mockActiveEventEdition,
      );

      // Mock the create method of PrismaService
      (prismaService.guidance.create as jest.Mock).mockResolvedValue(
        mockCreatedGuidance,
      );

      const result = await service.create(createDto);

      expect(eventEditionService.findActive).toHaveBeenCalledTimes(1);
      expect(prismaService.guidance.create).toHaveBeenCalledWith({
        data: {
          ...createDto,
          eventEditionId: mockActiveEventEdition.id, // Validate eventEditionId
        },
      });

      expect(result).toBeInstanceOf(ResponseGuidanceDto);
      expect(result).toEqual(new ResponseGuidanceDto(mockCreatedGuidance));
    });
  });

  describe('remove', () => {
    it('should successfully remove an existing guidance', async () => {
      const mockGuidanceToRemove = {
        id: 'guidance-1',
        summary: 'Orientação para Remover',
        authorGuidance: 'Descrição da orientação',
        reviewerGuidance: 'Descrição da orientação',
        audienceGuidance: 'Descrição da orientação',
        eventEditionId: 'event-edition-1',
        createdAt: new Date('2021-07-01T00:00:00.000Z'),
        updatedAt: new Date('2021-07-01T00:00:00.000Z'),
      };

      // Mock the findUnique method to simulate finding an existing guidance
      (prismaService.guidance.findUnique as jest.Mock).mockResolvedValue(
        mockGuidanceToRemove,
      );

      // Mock the delete method to simulate successful deletion
      (prismaService.guidance.delete as jest.Mock).mockResolvedValue(
        mockGuidanceToRemove,
      );

      const result = await service.remove(mockGuidanceToRemove.id);

      // Ensure findUnique is called with the correct ID
      expect(prismaService.guidance.findUnique).toHaveBeenCalledWith({
        where: { id: mockGuidanceToRemove.id },
      });

      // Ensure delete is called with the correct ID
      expect(prismaService.guidance.delete).toHaveBeenCalledWith({
        where: { id: mockGuidanceToRemove.id },
      });

      // Validate the result message
      expect(result).toEqual({
        message: 'Intância de orientação removida com sucesso.',
      });
    });

    it('should throw an exception when trying to remove a non-existent guidance', async () => {
      const nonExistentId = 'non-existent-id';

      (prismaService.guidance.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(nonExistentId)).rejects.toThrow(
        new AppException('Intância de orientação não encontrada.', 404),
      );

      expect(prismaService.guidance.findUnique).toHaveBeenCalledWith({
        where: { id: nonExistentId },
      });
      expect(prismaService.guidance.delete).not.toHaveBeenCalled();
    });
  });
});
