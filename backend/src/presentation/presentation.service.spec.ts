import { PrismaService } from '../prisma/prisma.service';
import { SubmissionService } from '../submission/submission.service';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { AppException } from '../exceptions/app.exception';
import { PresentationStatus } from '@prisma/client';
import { SubmissionStatus } from '@prisma/client';

describe('PresentationService', () => {
  let service: PresentationService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      submission: {
        findUnique: jest.fn(),
        delete: jest.fn(),
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
      eventEdition: {
        findUnique: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new PresentationService(
      prismaService,
      new SubmissionService(prismaService),
    );
  });

  describe('create', () => {
    it('should throw an error if submission is not found', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'nonexistentId',
        presentationBlockId: 'blockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
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

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({ id: '1' });

      await expect(service.create(createPresentationDto)).rejects.toThrow(
        new AppException('Apresentação já cadastrada.', 400),
      );
    });

    it('should throw an error if presentation block is not found', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'nonexistentBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });
      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(
        null,
      );
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue(null);

      await expect(service.create(createPresentationDto)).rejects.toThrowError(
        new AppException('Bloco de apresentação não encontrado.', 404),
      );
    });

    it('should throw an error if the position within block is already occupied', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValueOnce(
        null,
      );

      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'validBlockId',
        eventEditionId: 'event1',
        type: 'Presentation',
        duration: 60,
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValueOnce(
        {
          id: 'existingPresentationId',
          positionWithinBlock: 1,
          presentationBlockId: 'validBlockId',
        },
      );

      await expect(service.create(createPresentationDto)).rejects.toThrowError(
        new AppException('Posição de apresentação já ocupada.', 400),
      );
    });

    it('should create a presentation if all checks pass', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });
      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(
        null,
      );

      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'validBlockId',
        eventEditionId: 'event1',
        type: 'Presentation',
        duration: 60,
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      (prismaService.presentation.create as jest.Mock).mockResolvedValue({
        id: 'newPresentationId',
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      const createdPresentation = await service.create(createPresentationDto);

      expect(createdPresentation).toHaveProperty('id');
      expect(createdPresentation.submissionId).toBe('validSubmissionId');
    });
  });

  describe('createWithSubmission', () => {
    it('should create a submission and presentation when all details are provided', async () => {
      const createPresentationWithSubmissionDto = {
        advisorId: 'advisor1',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Test Presentation',
        abstractText: 'Abstract text',
        pdfFile: 'path/to/pdf',
        phoneNumber: '123456789',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'coAdvisor1',
        presentationBlockId: 'block1',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      };

      const mockSubmissionService = service['submissionService'] as any;
      mockSubmissionService.create = jest.fn().mockResolvedValue({
        id: 'submission1',
        ...createPresentationWithSubmissionDto,
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        name: 'Test Event',
      });

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission1',
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({ id: 'block1' });
      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(
        null,
      );
      (prismaService.presentation.create as jest.Mock).mockResolvedValue({
        id: 'presentation1',
        submissionId: 'submission1',
        presentationBlockId: 'block1',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      });

      const result = await service.createWithSubmission(
        createPresentationWithSubmissionDto,
      );

      expect(result).toHaveProperty('submission');
      expect(result).toHaveProperty('presentation');
      expect(result.submission.id).toBe('submission1');
      expect(result.presentation.submissionId).toBe('submission1');
    });

    it('should create only a submission if presentation details are not provided', async () => {
      const createPresentationWithSubmissionDto = {
        advisorId: 'advisor1',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Test Presentation',
        abstractText: 'Abstract text',
        pdfFile: 'path/to/pdf',
        phoneNumber: '123456789',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'coAdvisor1',
      };

      const mockSubmissionService = service['submissionService'] as any;
      mockSubmissionService.create = jest.fn().mockResolvedValue({
        id: 'submission1',
        ...createPresentationWithSubmissionDto,
      });

      mockSubmissionService.remove = jest.fn().mockResolvedValue({});

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        name: 'Test Event',
      });

      (prismaService.presentation.create as jest.Mock).mockResolvedValue(null);

      const result = await service.createWithSubmission(
        createPresentationWithSubmissionDto,
      );

      expect(result).toHaveProperty('submission');
      expect(result).not.toHaveProperty('presentation');
      expect(result.submission.id).toBe('submission1');

      expect(prismaService.presentation.create).not.toHaveBeenCalled();

      expect(mockSubmissionService.remove).not.toHaveBeenCalled();
    });

    it('should throw an error if submission creation fails', async () => {
      const createPresentationWithSubmissionDto = {
        advisorId: 'advisor1',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Test Presentation',
        abstractText: 'Abstract text',
        pdfFile: 'path/to/pdf',
        phoneNumber: '123456789',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'coAdvisor1',
        presentationBlockId: 'block1',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      };

      const mockSubmissionService = service['submissionService'] as any;
      mockSubmissionService.create = jest
        .fn()
        .mockRejectedValue(new AppException('Erro ao criar a submissão.', 500));

      await expect(
        service.createWithSubmission(createPresentationWithSubmissionDto),
      ).rejects.toThrowError(
        new AppException('Erro ao criar a submissão.', 500),
      );
    });
  });

  describe('findAllByEventEditionId', () => {
    it('should return presentations for a given event edition', async () => {
      const eventEditionId = 'event1';
      const mockPresentations = [
        {
          id: 'presentation1',
          submissionId: 'submission1',
          presentationBlockId: 'block1',
          positionWithinBlock: 1,
          submission: { eventEditionId: 'event1' },
        },
        {
          id: 'presentation2',
          submissionId: 'submission2',
          presentationBlockId: 'block2',
          positionWithinBlock: 2,
          submission: { eventEditionId: 'event1' },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      const presentations =
        await service.findAllByEventEditionId(eventEditionId);

      expect(presentations).toEqual(mockPresentations);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: {
          submission: {
            eventEditionId,
          },
        },
        include: {
          submission: true,
        },
      });
    });

    it('should return an empty array if no presentations exist for the event edition', async () => {
      const eventEditionId = 'event1';

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue([]);

      const presentations =
        await service.findAllByEventEditionId(eventEditionId);

      expect(presentations).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a presentation by id', async () => {
      const mockPresentation = {
        id: '1',
        submissionId: '1',
        presentationBlockId: '1',
        positionWithinBlock: 1,
        status: PresentationStatus.ToPresent,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        mockPresentation,
      );

      const presentation = await service.findOne('1');

      expect(presentation).toEqual(mockPresentation);
      expect(prismaService.presentation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          submission: true,
        },
      });
    });

    it('should throw an error if presentation not found', async () => {
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.findOne('nonexistentId')).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404),
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

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        null,
      );
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });

    it('should throw an error if presentation is not found during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'blockId',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404),
      );
    });

    it('should throw an error if presentation block is not found during update', async () => {
      const createPresentationDto: CreatePresentationDto = {
        submissionId: 'validSubmissionId',
        presentationBlockId: 'nonexistentBlockId',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue(null);

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Bloco de apresentação não encontrado.', 404),
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

      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'validBlockId',
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: 'existingPresentationId',
        submissionId: 'validSubmissionId',
        presentationBlockId: 'validBlockId',
        positionWithinBlock: 1,
      });

      (prismaService.presentation.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({
          id: 'existingPresentationId',
          submissionId: 'anotherSubmissionId',
          presentationBlockId: 'validBlockId',
          positionWithinBlock: 1,
        });

      await expect(service.update('1', createPresentationDto)).rejects.toThrow(
        new AppException('Posição de apresentação já ocupada.', 400),
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

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      const updatedPresentation = {
        ...existingPresentation,
        positionWithinBlock: 2,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        existingPresentation,
      );
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'validSubmissionId',
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'validBlockId',
      });
      (prismaService.presentation.update as jest.Mock).mockResolvedValue(
        updatedPresentation,
      );

      const result = await service.update('1', updatePresentationDto);

      expect(result.positionWithinBlock).toBe(2);
    });
  });

  describe('updateWithSubmission', () => {
    it('should update submission and presentation successfully', async () => {
      const id = 'presentation1';
      const updatePresentationWithSubmissionDto = {
        advisorId: 'newAdvisor',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Updated Presentation',
        abstractText: 'Updated abstract',
        pdfFile: 'path/to/new/pdf',
        phoneNumber: '987654321',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'newCoAdvisor',
        presentationBlockId: 'newBlock',
        positionWithinBlock: 2,
        status: PresentationStatus.Presented,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: 'presentation1',
        submissionId: 'submission1',
      });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        presentationDuration: 30,
      });

      const mockSubmissionService = service['submissionService'] as any;
      mockSubmissionService.update = jest.fn().mockResolvedValue({
        id: 'submission1',
        ...updatePresentationWithSubmissionDto,
      });

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission1',
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({ id: 'newBlock' });
      (prismaService.presentation.update as jest.Mock).mockResolvedValue({
        id: 'presentation1',
        submissionId: 'submission1',
        presentationBlockId: 'newBlock',
        positionWithinBlock: 2,
        status: PresentationStatus.Presented,
      });

      const result = await service.updateWithSubmission(
        id,
        updatePresentationWithSubmissionDto,
      );

      expect(result).toHaveProperty('submission');
      expect(result).toHaveProperty('presentation');
      expect(result.submission.id).toBe('submission1');
      expect(result.presentation.id).toBe('presentation1');
    });

    it('should throw an error if presentation is not found', async () => {
      const id = 'nonexistentPresentation';
      const updatePresentationWithSubmissionDto = {
        advisorId: 'newAdvisor',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Updated Presentation',
        abstractText: 'Updated abstract',
        pdfFile: 'path/to/new/pdf',
        phoneNumber: '987654321',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'newCoAdvisor',
        presentationBlockId: 'newBlock',
        positionWithinBlock: 2,
        status: PresentationStatus.Presented,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.updateWithSubmission(id, updatePresentationWithSubmissionDto),
      ).rejects.toThrow(new AppException('Apresentação não encontrada.', 404));
    });

    it('should throw an error if submission update fails', async () => {
      const id = 'presentation1';
      const updatePresentationWithSubmissionDto = {
        advisorId: 'newAdvisor',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Updated Presentation',
        abstractText: 'Updated abstract',
        pdfFile: 'path/to/new/pdf',
        phoneNumber: '987654321',
        submissionStatus: SubmissionStatus.Submitted,
        coAdvisor: 'newCoAdvisor',
        presentationBlockId: 'newBlock',
        positionWithinBlock: 2,
        status: PresentationStatus.Presented,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
        id: 'presentation1',
        submissionId: 'submission1',
      });

      const mockSubmissionService = service['submissionService'] as any;
      mockSubmissionService.update = jest
        .fn()
        .mockRejectedValue(new Error('Submission update failed'));

      await expect(
        service.updateWithSubmission(id, updatePresentationWithSubmissionDto),
      ).rejects.toThrow(
        new AppException('Erro ao atualizar a submissão.', 500),
      );
    });
  });

  describe('remove', () => {
    it('should throw an error if presentation not found during removal', async () => {
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.remove('nonexistentId')).rejects.toThrow(
        new AppException('Apresentação não encontrada.', 404),
      );
    });

    it('should remove the presentation and return success message', async () => {
      const id = 'existingId';

      const mockDeletedPresentation = {
        id: 'existingId',
        submissionId: '1',
        presentationBlockId: '1',
        positionWithinBlock: 1,
      };

      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        mockDeletedPresentation,
      );

      (prismaService.presentation.delete as jest.Mock).mockResolvedValue(
        mockDeletedPresentation,
      );

      const response = await service.remove(id);

      expect(response).toEqual({
        message: 'Apresentação removida com sucesso.',
      });
      expect(prismaService.presentation.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
