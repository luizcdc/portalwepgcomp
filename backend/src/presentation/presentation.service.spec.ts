import { PrismaService } from '../prisma/prisma.service';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { AppException } from '../exceptions/app.exception';
import { PresentationStatus } from '@prisma/client';

describe('PresentationService', () => {
  let service: PresentationService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      submission: {
        findUnique: jest.fn(),
      },
      presentation: {
        findFirst: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      presentationBlock: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new PresentationService(prismaService);
  });

  describe('create', () => {
    it('should throw an error if submission is not found', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'nonexistentId',
        presentationBlockId: 'blockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404)
      );
    });

    it('should throw an error if presentation is already registered for submission', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'existingSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue({
        id: 'anotherPresentationId',
        submissionId: 'anotherSubmissionId',
        presentationBlockId: 'otherValidBlockId',
        positionWithinBlock: 1,
      });

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Apresentação já cadastrada.', 400)
      );
    });

    it('should throw an error if presentation block is not found', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'nonexistentBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Bloco de apresentação não encontrado.', 404)
      );
    });

    it('should throw an error if the position within block is already occupied', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentation.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existingPresentationId',
          submissionId: 'anotherSubmissionId',
          presentationBlockId: 'validBlockId',
          positionWithinBlock: 1,
        });

      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Posição de apresentação já ocupada.', 400)
      );
    });

    it('should create a presentation if all checks pass', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentation.create as jest.Mock).mockResolvedValue({
        id: 'newPresentationId',
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      });

      const createdPresentation = await service.create(createPresentationDto);

      expect(createdPresentation).toHaveProperty('id');
      expect(createdPresentation.submissionId).toBe('validSubmissionId');
    });
  });

  describe('findAll', () => {
    it('should return all presentations', async () => {
      const mockPresentations = [
        { id: '1', submissionId: '1', presentationBlockId: '1', positionWithinBlock: 1, status: PresentationStatus.ToPresent },
        { id: '2', submissionId: '2', presentationBlockId: '2', positionWithinBlock: 2, status: PresentationStatus.ToPresent },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(mockPresentations);

      const presentations = await service.findAll();

      expect(presentations).toEqual(mockPresentations);
      expect(prismaService.presentation.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a presentation by id', async () => {
      const mockPresentation = { id: '1', submissionId: '1', presentationBlockId: '1', positionWithinBlock: 1, status: PresentationStatus.ToPresent };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(mockPresentation);

      const presentation = await service.findOne('1');

      expect(presentation).toEqual(mockPresentation);
      expect(prismaService.presentation.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw an error if presentation not found', async () => {
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('nonexistentId')).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404)
      );
    });
  });

  describe('update', () => {
    it('should throw an error if submission is not found during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'nonexistentId',
        presentationBlockId: 'blockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404)
      );
    });

    it('should throw an error if presentation is not found during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'blockId',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404)
      );
    });

    it('should throw an error if presentation block is not found during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'nonexistentBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Bloco de apresentação não encontrado.', 404)
      );
    });

    it('should throw an error if the position within block is already occupied during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'validSubmissionId',
      });

      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue({
        id: 'validBlockId',
      });

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: 'existingPresentationId',
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      });


      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existingPresentationId',
          submissionId: 'anotherSubmissionId',
          presentationBlockId: 'validBlockId',
          positionWithinBlock: 1,
        });

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Posição de apresentação já ocupada.', 400)
      );
    });

    it('should update a presentation if all checks pass', async () => {
      const updatePresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 2,
      };

      const existingPresentation = {
        id: '1',
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      };

      const updatedPresentation = {
        ...existingPresentation,
        positionWithinBlock: 2,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(existingPresentation);
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: 'validSubmissionId' });
      (prismaService.presentationBlock.findUnique as jest.Mock).mockResolvedValue({
        id: 'validBlockId',
      });
      (prismaService.presentation.update as jest.Mock).mockResolvedValue(updatedPresentation);

      const result = await service.update('1', updatePresentationDto);

      expect(result.positionWithinBlock).toBe(2);
    });
  });

  describe('remove', () => {
    it('should throw an error if presentation not found during removal', async () => {
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('nonexistentId')).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404)
      );
    });

    it('should remove the presentation and return success message', async () => {
      const id = 'existingId';

      const mockDeletedPresentation = { id: 'existingId', submissionId: '1', presentationBlockId: '1', positionWithinBlock: 1 };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(mockDeletedPresentation);

      (prismaService.presentation.delete as jest.Mock).mockResolvedValue(mockDeletedPresentation);

      const response = await service.remove(id);

      expect(response).toEqual({ message: 'Apresentação removida com sucesso.' });
      expect(prismaService.presentation.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });

  describe('listUserPresentations', () => {
    it('should return presentations for a given user', async () => {
      const userId = 'user-id';
      const mockSubmissions = [
        {
          id: 'submission-1',
          Presentation: [
            { id: 'presentation-1', positionWithinBlock: 1 },
            { id: 'presentation-2', positionWithinBlock: 2 },
          ],
        },
        {
          id: 'submission-2',
          Presentation: [{ id: 'presentation-3', positionWithinBlock: 1 }],
        },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(mockSubmissions);

      const presentations = await service.listUserPresentations(userId);

      expect(presentations).toEqual([
        { id: 'presentation-1', positionWithinBlock: 1 },
        { id: 'presentation-2', positionWithinBlock: 2 },
        { id: 'presentation-3', positionWithinBlock: 1 },
      ]);
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { mainAuthorId: userId },
        include: { Presentation: true },
      });
    });

    it('should return an empty array if no submissions are found', async () => {
      const userId = 'user-id';

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue([]);

      const presentations = await service.listUserPresentations(userId);

      expect(presentations).toEqual([]);
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { mainAuthorId: userId },
        include: { Presentation: true },
      });
    });
  });

  describe('updatePresentationForUser', () => {
    it('should update a presentation if it belongs to the user', async () => {
      const userId = 'user-id';
      const presentationId = 'presentation-id';
      const updateDto = { positionWithinBlock: 2 };

      const mockPresentation = {
        id: presentationId,
        submission: { mainAuthorId: userId },
      };

      const updatedPresentation = {
        id: presentationId,
        positionWithinBlock: 2,
      };

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(mockPresentation);
      (prismaService.presentation.update as jest.Mock).mockResolvedValue(updatedPresentation);

      const result = await service.updatePresentationForUser(
        userId,
        presentationId,
        updateDto,
      );

      expect(result).toEqual(updatedPresentation);
      expect(prismaService.presentation.findFirst).toHaveBeenCalledWith({
        where: {
          id: presentationId,
          submission: { mainAuthorId: userId },
        },
      });
      expect(prismaService.presentation.update).toHaveBeenCalledWith({
        where: { id: presentationId },
        data: updateDto,
      });
    });

    it('should throw an error if presentation does not belong to the user', async () => {
      const userId = 'user-id';
      const presentationId = 'presentation-id';
      const updateDto = { positionWithinBlock: 2 };

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updatePresentationForUser(userId, presentationId, updateDto),
      ).rejects.toThrow(
        new AppException('Apresentação não encontrada ou não pertence ao usuário.', 404),
      );
      expect(prismaService.presentation.findFirst).toHaveBeenCalledWith({
        where: {
          id: presentationId,
          submission: { mainAuthorId: userId },
        },
      });
    });
  });
});
