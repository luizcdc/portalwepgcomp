import { PrismaService } from '../prisma/prisma.service';
import { SubmissionService } from '../submission/submission.service';
import { ScoringService } from '../scoring/scoring.service';
import { PresentationService } from './presentation.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { PresentationResponseDto } from './dto/response-presentation.dto';
import { AppException } from '../exceptions/app.exception';
import { PresentationStatus, Profile, UserLevel } from '@prisma/client';
import { SubmissionStatus } from '@prisma/client';
import { PresentationBlockType } from '@prisma/client';
import { CreatePresentationWithSubmissionDto } from './dto/create-presentation-with-submission.dto';

const baseCreatePresentationWithSubmissionDto: CreatePresentationWithSubmissionDto =
  {
    advisorId: 'advisor1',
    mainAuthorId: 'author1',
    eventEditionId: 'event1',
    title: 'Test Presentation',
    abstractText: 'Abstract text',
    pdfFile: 'path/to/pdf',
    phoneNumber: '123456789',
    coAdvisor: 'coAdvisor1',
    presentationBlockId: 'block1',
    positionWithinBlock: 1,
    status: PresentationStatus.ToPresent,
  };

describe('PresentationService', () => {
  let service: PresentationService;
  let prismaService: PrismaService;
  let submissionService: SubmissionService;
  let scoringService: ScoringService;

  beforeEach(() => {
    prismaService = {
      submission: {
        findUnique: jest.fn(),
        delete: jest.fn(),
        create: jest.fn(),
        findMany: jest.fn(),
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
        findFirst: jest.fn(),
      },
      userAccount: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    } as any;

    submissionService = {
      validateSubmission: jest.fn().mockResolvedValue(true),
    } as any;

    scoringService = {
      recalculateAllScores: jest.fn(),
    } as any;

    service = new PresentationService(
      prismaService,
      submissionService,
      scoringService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
        status: SubmissionStatus.Confirmed,
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

      // Mock the submission to exist and be confirmed
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: '1',
        status: SubmissionStatus.Confirmed,
      });

      // Mock the presentation block to exist
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'validBlockId',
        eventEditionId: 'event1',
        duration: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
        roomId: 'room1',
        type: PresentationBlockType.Presentation,
        title: 'Block Title',
        speakerName: 'Speaker Name',
        startTime: new Date(),
      });

      // Mock the event edition to exist
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Event Name',
        description: 'Event Description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location',
        startDate: new Date(),
        endDate: new Date(),
        presentationDuration: 30,
        presentationsPerPresentationBlock: 4,
        submissionDeadline: new Date(),
        isActive: true,
        isEvaluationRestrictToLoggedUsers: false,
      });

      // First call simulates no duplicate presentations by submissionId
      (prismaService.presentation.findFirst as jest.Mock)
        .mockResolvedValueOnce(null) // Check for duplicates
        .mockResolvedValueOnce({
          id: 'existingPresentationId',
          presentationBlockId: 'validBlockId',
          positionWithinBlock: 1,
          submissionId: 'otherSubmissionId', // Different submissionId, but same position
          status: PresentationStatus.ToPresent,
          createdAt: new Date(),
          updatedAt: new Date(),
          publicAverageScore: 0,
          evaluatorsAverageScore: 0,
        }); // Check for overlapping in block and position

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
        status: SubmissionStatus.Confirmed,
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
        ...baseCreatePresentationWithSubmissionDto,
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
        status: SubmissionStatus.Confirmed,
      });

      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'block1',
      });

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
        ...baseCreatePresentationWithSubmissionDto,
      };

      delete createPresentationWithSubmissionDto.presentationBlockId;
      delete createPresentationWithSubmissionDto.positionWithinBlock;

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
        createPresentationWithSubmissionDto as any,
      );

      expect(result).toHaveProperty('submission');
      expect(result).not.toHaveProperty('presentation');
      expect(result.submission.id).toBe('submission1');

      expect(prismaService.presentation.create).not.toHaveBeenCalled();

      expect(mockSubmissionService.remove).not.toHaveBeenCalled();
    });

    it('should throw an error if submission creation fails', async () => {
      // Mocking the presentations returned by Prisma
      const createPresentationWithSubmissionDto = {
        advisorId: 'advisor1',
        mainAuthorId: 'author1',
        eventEditionId: 'event1',
        title: 'Test Presentation',
        abstractText: 'Abstract text',
        pdfFile: 'path/to/pdf',
        phoneNumber: '123456789',
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
      // Mock the presentation block for calculatePresentationStartTime
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        id: 'block1',
        eventEditionId: 'event1',
        duration: 120,
        createdAt: new Date(),
        updatedAt: new Date(),
        roomId: 'room1',
        type: PresentationBlockType.Presentation,
        title: 'Block Title',
        speakerName: 'Speaker Name',
        startTime: new Date(),
      });

      // Mock the event edition
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event1',
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Event Name',
        description: 'Event Description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location',
        startDate: new Date(),
        endDate: new Date(),
        presentationDuration: 30,
        presentationsPerPresentationBlock: 4,
        submissionDeadline: new Date(),
        isActive: true,
        isEvaluationRestrictToLoggedUsers: false,
      });

      // Mock the presentations returned by Prisma
      const mockPresentations = [
        {
          id: 'presentation1',
          submission: {
            id: 'submission1',
            advisor: { id: 'advisor1', name: 'Advisor Name' },
            mainAuthor: { id: 'author1', name: 'Author Name' },
          },
          presentationBlockId: 'block1',
          positionWithinBlock: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: PresentationStatus.ToPresent,
          publicAverageScore: 4.5,
          evaluatorsAverageScore: 4.8,
        },
        {
          id: 'presentation2',
          submission: {
            id: 'submission2',
            advisor: { id: 'advisor2', name: 'Another Advisor' },
            mainAuthor: { id: 'author2', name: 'Another Author' },
          },
          presentationBlockId: 'block2',
          positionWithinBlock: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: PresentationStatus.ToPresent,
          publicAverageScore: 3.5,
          evaluatorsAverageScore: 4.0,
        },
      ];

      // Mock the Prisma findMany method
      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );

      // Call the method
      const result = await service.findAllByEventEditionId('event1');

      // Assertions
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(PresentationResponseDto);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: {
          submission: {
            eventEditionId: 'event1',
          },
        },
        include: {
          submission: {
            include: {
              advisor: true,
              mainAuthor: true,
            },
          },
        },
      });
    });

    it('should return an empty array if no presentations exist for the event edition', async () => {
      // Mock Prisma findMany method to return an empty array
      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue([]);

      // Call the method
      const presentations = await service.findAllByEventEditionId('event1');

      // Assertions
      expect(presentations).toHaveLength(0);
      expect(prismaService.presentation.findMany).toHaveBeenCalledWith({
        where: {
          submission: {
            eventEditionId: 'event1',
          },
        },
        include: {
          submission: {
            include: {
              advisor: true,
              mainAuthor: true,
            },
          },
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a presentation by id', async () => {
      const mockPresentation = {
        id: '1',
        submission: {
          id: 'submission1',
          mainAuthor: { id: 'author1', name: 'Main Author' },
          advisor: { id: 'advisor1', name: 'Advisor' },
        },
        presentationBlockId: 'block1',
        positionWithinBlock: 2,
        status: 'ToPresent',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockPresentationBlock = {
        id: 'block1',
        eventEditionId: 'event1',
        duration: 120,
        startTime: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        roomId: 'room1',
        type: 'Presentation',
        title: 'Block Title',
        speakerName: 'Speaker Name',
      };

      const mockEventEdition = {
        id: 'event1',
        presentationDuration: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Event Name',
        description: 'Event Description',
        callForPapersText: 'Call for Papers',
        partnersText: 'Partners',
        location: 'Location',
        startDate: new Date(),
        endDate: new Date(),
        presentationsPerPresentationBlock: 4,
        submissionDeadline: new Date(),
        isActive: true,
        isEvaluationRestrictToLoggedUsers: false,
      };

      // Mock Prisma methods
      (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
        mockPresentation,
      );
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue(mockPresentationBlock);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(
        mockEventEdition,
      );

      // Call the method
      const presentation = await service.findOne('1');

      // Assertions
      expect(presentation).toBeInstanceOf(PresentationResponseDto);
      expect(prismaService.presentation.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          submission: {
            include: {
              advisor: true,
              mainAuthor: true,
            },
          },
        },
      });
      expect(prismaService.presentationBlock.findUnique).toHaveBeenCalledWith({
        where: { id: 'block1' },
      });
      expect(prismaService.eventEdition.findUnique).toHaveBeenCalledWith({
        where: { id: 'event1' },
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
        status: SubmissionStatus.Confirmed,
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
        status: SubmissionStatus.Confirmed,
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
        status: SubmissionStatus.Confirmed,
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
        status: SubmissionStatus.Confirmed,
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

      // Mock the findMany method to return mock submissions
      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(
        mockSubmissions,
      );

      // Call the method
      const presentations = await service.listUserPresentations(userId);

      // Assertions
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

      // Mock the findMany method to return an empty array
      (prismaService.submission.findMany as jest.Mock).mockResolvedValue([]);

      // Call the method
      const presentations = await service.listUserPresentations(userId);

      // Assertions
      expect(presentations).toEqual([]);
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { mainAuthorId: userId },
        include: { Presentation: true },
      });
    });
  });

  describe('listAdvisedPresentations', () => {
    const mockUserId = 'user123';

    it('should return advised presentations for a professor', async () => {
      const mockUser = {
        id: 'd0219835-245e-47b5-84ce-1e3369cf3c61',
        name: 'Professor Default',
        email: 'profdefault@example.com',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.Professor,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date('2024-12-27T15:50:13.008Z'),
        updatedAt: new Date('2024-12-27T15:50:13.008Z'),
        isVerified: false,
        password: 'a',
      };
      const mockSubmissions = [
        {
          id: 'ebd08e6a-78e3-46c2-8acb-0b2f399f886a',
          advisorId: '21b47928-172e-4014-a505-95c9d7e85350',
          mainAuthorId: '0c7a2281-2761-492c-8522-74888c6ad039',
          eventEditionId: 'c63b4c5e-8dec-4457-a776-9445411629f0',
          title: 'The Impact of AI in Modern Research',
          abstract: 'A study on how AI impacts modern research methodologies.',
          pdfFile: 'path/to/document1.pdf',
          phoneNumber: '123-456-7890',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          proposedStartTime: null,
          coAdvisor: null,
          status: SubmissionStatus.Submitted,
          createdAt: new Date('2024-12-27T15:50:13.022Z'),
          updatedAt: new Date('2024-12-27T15:50:13.022Z'),
          Presentation: [{ id: 'pres1', title: 'Presentation 1' }],
        },
        {
          id: '0cd25aa5-50d4-4f95-bc6a-f8cbcac3fb4c',
          advisorId: 'b9d9666d-86fa-4fe7-98a7-df80f2f8bcc9',
          mainAuthorId: 'ac3c4dca-c531-44f2-b7f8-3e606d37baf1',
          eventEditionId: 'c63b4c5e-8dec-4457-a776-9445411629f0',
          title: 'Quantum Computing Advances',
          abstract: 'Exploring the latest advancements in quantum computing.',
          pdfFile: 'path/to/document2.pdf',
          phoneNumber: '123-456-7891',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          proposedStartTime: null,
          coAdvisor: null,
          status: SubmissionStatus.Submitted,
          createdAt: new Date('2024-12-27T15:50:13.024Z'),
          updatedAt: new Date('2024-12-27T15:50:13.024Z'),
          Presentation: [{ id: 'pres2', title: 'Presentation 2' }],
        },
      ];

      jest
        .spyOn(prismaService.userAccount, 'findUnique')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.submission, 'findMany')
        .mockResolvedValue(mockSubmissions);

      const result = await service.listAdvisedPresentations(mockUserId);

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { advisorId: mockUserId },
        include: { Presentation: true },
      });
      expect(result).toEqual([
        { id: 'pres1', title: 'Presentation 1' },
        { id: 'pres2', title: 'Presentation 2' },
      ]);
    });

    it('should throw AppException if user is not a professor', async () => {
      const mockUser = {
        id: 'ac3c4dca-c531-44f2-b7f8-3e606d37baf1',
        name: 'Doctoral Student Default',
        email: 'docdefault@example.com',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.DoctoralStudent,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date('2024-12-27T15:50:13.008Z'),
        updatedAt: new Date('2024-12-27T15:50:13.008Z'),
        isVerified: false,
        password: 'a',
      };

      jest
        .spyOn(prismaService.userAccount, 'findUnique')
        .mockResolvedValue(mockUser);

      await expect(
        service.listAdvisedPresentations(mockUserId),
      ).rejects.toThrow(new AppException('Usuário não é um professor.', 403));

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.submission.findMany).not.toHaveBeenCalled();
    });

    it('should return an empty array if no submissions found', async () => {
      const mockUser = {
        id: 'd0219835-245e-47b5-84ce-1e3369cf3c61',
        name: 'Professor Default',
        email: 'profdefault@example.com',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.Professor,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date('2024-12-27T15:50:13.008Z'),
        updatedAt: new Date('2024-12-27T15:50:13.008Z'),
        isVerified: false,
        password: 'a',
      };

      jest
        .spyOn(prismaService.userAccount, 'findUnique')
        .mockResolvedValue(mockUser);
      jest.spyOn(prismaService.submission, 'findMany').mockResolvedValue([]);

      const result = await service.listAdvisedPresentations(mockUserId);

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { advisorId: mockUserId },
        include: { Presentation: true },
      });
      expect(result).toEqual([]);
    });

    it('should handle submissions without presentations', async () => {
      const mockUser = {
        id: 'd0219835-245e-47b5-84ce-1e3369cf3c61',
        name: 'Professor Default',
        email: 'profdefault@example.com',
        registrationNumber: null,
        photoFilePath: null,
        profile: Profile.Professor,
        level: UserLevel.Default,
        isActive: true,
        createdAt: new Date('2024-12-27T15:50:13.008Z'),
        updatedAt: new Date('2024-12-27T15:50:13.008Z'),
        isVerified: false,
        password: 'a',
      };

      const mockSubmissions = [
        {
          id: 'ebd08e6a-78e3-46c2-8acb-0b2f399f886a',
          advisorId: '21b47928-172e-4014-a505-95c9d7e85350',
          mainAuthorId: '0c7a2281-2761-492c-8522-74888c6ad039',
          eventEditionId: 'c63b4c5e-8dec-4457-a776-9445411629f0',
          title: 'The Impact of AI in Modern Research',
          abstract: 'A study on how AI impacts modern research methodologies.',
          pdfFile: 'path/to/document1.pdf',
          phoneNumber: '123-456-7890',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          proposedStartTime: null,
          coAdvisor: null,
          status: SubmissionStatus.Submitted,
          createdAt: new Date('2024-12-27T15:50:13.022Z'),
          updatedAt: new Date('2024-12-27T15:50:13.022Z'),
          Presentation: [],
        },
        {
          id: '0cd25aa5-50d4-4f95-bc6a-f8cbcac3fb4c',
          advisorId: 'b9d9666d-86fa-4fe7-98a7-df80f2f8bcc9',
          mainAuthorId: 'ac3c4dca-c531-44f2-b7f8-3e606d37baf1',
          eventEditionId: 'c63b4c5e-8dec-4457-a776-9445411629f0',
          title: 'Quantum Computing Advances',
          abstract: 'Exploring the latest advancements in quantum computing.',
          pdfFile: 'path/to/document2.pdf',
          phoneNumber: '123-456-7891',
          proposedPresentationBlockId: null,
          proposedPositionWithinBlock: null,
          proposedStartTime: null,
          coAdvisor: null,
          status: SubmissionStatus.Submitted,
          createdAt: new Date('2024-12-27T15:50:13.024Z'),
          updatedAt: new Date('2024-12-27T15:50:13.024Z'),
          Presentation: [{ id: 'pres2', title: 'Presentation 2' }],
        },
      ];

      jest
        .spyOn(prismaService.userAccount, 'findUnique')
        .mockResolvedValue(mockUser);
      jest
        .spyOn(prismaService.submission, 'findMany')
        .mockResolvedValue(mockSubmissions);

      const result = await service.listAdvisedPresentations(mockUserId);

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.submission.findMany).toHaveBeenCalledWith({
        where: { advisorId: mockUserId },
        include: { Presentation: true },
      });
      expect(result).toEqual([{ id: 'pres2', title: 'Presentation 2' }]);
    });

    it('should throw an error if user is not found', async () => {
      jest
        .spyOn(prismaService.userAccount, 'findUnique')
        .mockResolvedValue(null);

      await expect(
        service.listAdvisedPresentations(mockUserId),
      ).rejects.toThrow();

      expect(prismaService.userAccount.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.submission.findMany).not.toHaveBeenCalled();
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

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(
        mockPresentation,
      );
      (prismaService.presentation.update as jest.Mock).mockResolvedValue(
        updatedPresentation,
      );

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

      (prismaService.presentation.findFirst as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.updatePresentationForUser(userId, presentationId, updateDto),
      ).rejects.toThrow(
        new AppException(
          'Apresentação não encontrada ou não pertence ao usuário.',
          404,
        ),
      );
      expect(prismaService.presentation.findFirst).toHaveBeenCalledWith({
        where: {
          id: presentationId,
          submission: { mainAuthorId: userId },
        },
      });
    });
  });

  describe('bookmark methods', () => {
    describe('bookmarkPresentation', () => {
      it('should bookmark a presentation for a user', async () => {
        const userId = 'user1';
        const presentationId = 'presentation1';
        const bookmarkDto = { presentationId };

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
        });

        (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
          id: presentationId,
        });

        (prismaService.userAccount.update as jest.Mock).mockResolvedValue({
          id: userId,
          bookmarkedPresentations: [{ id: presentationId }],
        });

        const result = await service.bookmarkPresentation(bookmarkDto, userId);

        expect(result.bookmarkedPresentations).toEqual([
          { id: presentationId },
        ]);
      });

      it('should throw error if user not found', async () => {
        const userId = 'nonexistent';
        const bookmarkDto = { presentationId: 'presentation1' };

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        await expect(
          service.bookmarkPresentation(bookmarkDto, userId),
        ).rejects.toThrow(new AppException('Usuário não encontrado.', 404));
      });

      it('should throw error if presentation not found', async () => {
        const userId = 'user1';
        const bookmarkDto = { presentationId: 'nonexistent' };

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
        });
        (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        await expect(
          service.bookmarkPresentation(bookmarkDto, userId),
        ).rejects.toThrow(
          new AppException('Apresentação não encontrada.', 404),
        );
      });
    });

    describe('bookmarkedPresentation', () => {
      it('should return true if presentation is bookmarked', async () => {
        const userId = 'user1';
        const presentationId = 'presentation1';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
          bookmarkedPresentations: [{ id: presentationId }],
        });

        const result = await service.bookmarkedPresentation(
          userId,
          presentationId,
        );
        expect(result.bookmarked).toBe(true);
      });

      it('should return false if presentation is not bookmarked', async () => {
        const userId = 'user1';
        const presentationId = 'presentation1';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        const result = await service.bookmarkedPresentation(
          userId,
          presentationId,
        );
        expect(result.bookmarked).toBe(false);
      });
    });

    describe('bookmarkedPresentations', () => {
      it('should return all bookmarked presentations for user', async () => {
        const userId = 'user1';
        const mockBookmarks = [
          { id: 'presentation1' },
          { id: 'presentation2' },
        ];

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
          bookmarkedPresentations: mockBookmarks,
        });

        const result = await service.bookmarkedPresentations(userId);
        expect(result.bookmarkedPresentations).toEqual(mockBookmarks);
      });

      it('should throw error if user not found', async () => {
        const userId = 'nonexistent';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        await expect(service.bookmarkedPresentations(userId)).rejects.toThrow(
          new AppException('Usuário não encontrado.', 404),
        );
      });
    });

    describe('removePresentationBookmark', () => {
      it('should remove a presentation bookmark', async () => {
        const userId = 'user1';
        const firstPresentationId = 'presentation1';
        const secondPresentationId = 'presentation2';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
        });

        (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue({
          id: firstPresentationId,
        });

        (prismaService.userAccount.update as jest.Mock).mockResolvedValue({
          id: userId,
          bookmarkedPresentations: [{ id: secondPresentationId }],
        });

        const result = await service.removePresentationBookmark(
          firstPresentationId,
          userId,
        );

        expect(result.bookmarkedPresentations).toEqual([
          { id: secondPresentationId },
        ]);
      });

      it('should throw error if user not found', async () => {
        const userId = 'nonexistent';
        const presentationId = 'presentation1';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        await expect(
          service.removePresentationBookmark(presentationId, userId),
        ).rejects.toThrow(new AppException('Usuário não encontrado.', 404));
      });

      it('should throw error if presentation not found', async () => {
        const userId = 'user1';
        const presentationId = 'nonexistent';

        (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({
          id: userId,
        });
        (prismaService.presentation.findUnique as jest.Mock).mockResolvedValue(
          null,
        );

        await expect(
          service.removePresentationBookmark(presentationId, userId),
        ).rejects.toThrow(
          new AppException('Apresentação não encontrada.', 404),
        );
      });
    });
  });

  describe('recalculateAllScores', () => {
    it('should successfully recalculate scores for an event edition', async () => {
      const eventEditionId = 'event1';

      // Mock eventEdition exists
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: eventEditionId,
        name: 'Test Event',
      });

      await service.recalculateAllScores(eventEditionId);

      // Verify scoringService was called
      expect(scoringService.recalculateAllScores).toHaveBeenCalledWith(
        eventEditionId,
      );
    });

    it('should throw an error if event edition is not found', async () => {
      const eventEditionId = 'nonexistent';

      // Mock eventEdition doesn't exist
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.recalculateAllScores(eventEditionId),
      ).rejects.toThrow('Edição do evento não encontrada.');

      // Verify scoringService was not called
      expect(scoringService.recalculateAllScores).not.toHaveBeenCalled();
    });
  });

  describe('calculateScoresForActiveEvent', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate scores for active event', async () => {
      const mockActiveEvent = {
        id: 'active1',
        name: 'Active Event',
        endDate: new Date('2025-12-31'),
      };

      (prismaService.eventEdition.findFirst as jest.Mock).mockResolvedValueOnce(
        mockActiveEvent,
      );

      (
        prismaService.eventEdition.findUnique as jest.Mock
      ).mockResolvedValueOnce(mockActiveEvent);

      await service.calculateScoresForActiveEvent();

      expect(scoringService.recalculateAllScores).toHaveBeenCalledWith(
        mockActiveEvent.id,
      );
    });

    it('should not calculate scores if no active event exists', async () => {
      (prismaService.eventEdition.findFirst as jest.Mock).mockResolvedValueOnce(
        null,
      );

      await service.calculateScoresForActiveEvent();

      expect(scoringService.recalculateAllScores).not.toHaveBeenCalled();
    });

    it('should not calculate scores if active event has ended', async () => {
      const mockEndedEvent = {
        id: 'ended1',
        name: 'Ended Event',
        endDate: new Date('2024-01-01'),
      };

      (prismaService.eventEdition.findFirst as jest.Mock).mockResolvedValueOnce(
        mockEndedEvent,
      );

      await service.calculateScoresForActiveEvent();

      expect(scoringService.recalculateAllScores).not.toHaveBeenCalled();
    });

    it('should handle errors during score calculation', async () => {
      const mockActiveEvent = {
        id: 'active1',
        name: 'Active Event',
        endDate: new Date('2025-12-31'),
      };

      (prismaService.eventEdition.findFirst as jest.Mock).mockResolvedValueOnce(
        mockActiveEvent,
      );

      (
        prismaService.eventEdition.findUnique as jest.Mock
      ).mockResolvedValueOnce(mockActiveEvent);

      (scoringService.recalculateAllScores as jest.Mock).mockRejectedValueOnce(
        new Error('Scoring failed'),
      );

      await expect(
        service.calculateScoresForActiveEvent(),
      ).resolves.not.toThrow();
    });
  });
});
