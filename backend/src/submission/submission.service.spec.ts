import { Profile } from '@prisma/client';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionStatus } from '@prisma/client';
import { ResponseSubmissionDto } from './dto/response-submission.dto';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      userAccount: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      eventEdition: {
        findUnique: jest.fn(),
      },
      submission: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      presentationBlock: {
        findUnique: jest.fn(),
      },
      presentation: {
        findFirst: jest.fn(),
      },
      coAuthor: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new SubmissionService(prismaService);
  });

  describe('create', () => {
    const validCreateSubmissionDto: CreateSubmissionDto = {
      advisorId: 'advisor-id',
      mainAuthorId: 'author123',
      eventEditionId: 'event123',
      title: 'Test Submission',
      abstractText: 'Abstract of the submission',
      pdfFile: 'file.pdf',
      phoneNumber: '1234567890',
      status: SubmissionStatus.Submitted,
      coAdvisor: 'co-advisor-id',
    };

    it('should create a submission successfully', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.submission.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.submission.create as jest.Mock).mockResolvedValue({
        ...validCreateSubmissionDto,
        id: 'submission123',
      });

      const result = await service.create(validCreateSubmissionDto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(validCreateSubmissionDto.title);
    });

    it('should throw an error when mainAuthorId does not exist', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event-edition-id',
      });

      await expect(
        service.create({
          ...validCreateSubmissionDto,
          mainAuthorId: 'invalid-main-author-id',
        }),
      ).rejects.toThrowError(
        new AppException('Autor principal não encontrado.', 404),
      );
    });

    it('should throw error if advisor not found', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
      ]);

      await expect(
        service.create({
          ...validCreateSubmissionDto,
          advisorId: 'invalidAdvisor',
        }),
      ).rejects.toThrow(new AppException('Orientador não encontrado.', 404));
    });

    it('should throw error if event edition not found', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.create({
          ...validCreateSubmissionDto,
          eventEditionId: 'invalidEvent',
        }),
      ).rejects.toThrow(
        new AppException('Edição do evento não encontrada.', 404),
      );
    });

    it('should throw error if main author already submitted', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.submission.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-submission',
      });

      await expect(service.create(validCreateSubmissionDto)).rejects.toThrow(
        new AppException(
          'Autor principal já enviou uma submissão para esta edição do evento.',
          400,
        ),
      );
    });

    it('should throw error if submission with same title exists', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
        submissionDeadline: new Date(Date.now() + 86400000), // tomorrow
      });
      (prismaService.submission.findFirst as jest.Mock)
        .mockResolvedValueOnce(null) // for mainAuthorAlreadySubmitted check
        .mockResolvedValueOnce({
          // for sameTittleExists check
          id: 'existing-submission',
          title: 'Test Submission',
        });

      await expect(service.create(validCreateSubmissionDto)).rejects.toThrow(
        new AppException(
          'Já existe uma submissão com o mesmo título para essa edição do evento.',
          400,
        ),
      );
    });

    it('should throw error if submission deadline has passed', async () => {
      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'author123' },
        { id: 'advisor-id', profile: Profile.Professor },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
        submissionDeadline: new Date(Date.now() - 86400000), // yesterday
      });
      (prismaService.submission.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.create(validCreateSubmissionDto)).rejects.toThrow(
        new AppException(
          'O prazo para submissão de trabalhos nessa edição do evento já chegou ao fim.',
          400,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return submissions with proposed start times', async () => {
      const eventEditionId = 'event123';
      const submissions = [
        {
          id: 'submission1',
          eventEditionId,
          proposedPresentationBlockId: 'block1',
          proposedPositionWithinBlock: 0,
        },
      ];

      (prismaService.submission.findMany as jest.Mock).mockResolvedValue(
        submissions,
      );
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        presentationDuration: 30,
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        startTime: new Date('2023-01-01T09:00:00Z'),
      });

      const result = await service.findAll(eventEditionId, false, false, false);

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toBeInstanceOf(ResponseSubmissionDto);
    });
  });

  describe('findOne', () => {
    it('should find a submission by id', async () => {
      const submission = {
        id: 'submission123',
        title: 'Test Submission',
        eventEditionId: 'event123',
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        submission,
      );
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        presentationDuration: 30,
      });
      (
        prismaService.presentationBlock.findUnique as jest.Mock
      ).mockResolvedValue({
        startTime: new Date('2023-01-01T09:00:00Z'),
      });

      const result = await service.findOne('submission123');
      expect(result).toBeInstanceOf(ResponseSubmissionDto);
    });

    it('should throw error if submission not found', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.findOne('invalidId')).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });
  });

  describe('update', () => {
    const validUpdateSubmissionDto: UpdateSubmissionDto = {
      advisorId: 'advisor123',
      mainAuthorId: 'author123',
      eventEditionId: 'event123',
      title: 'Updated Submission',
      abstractText: 'Updated abstract',
      pdfFile: 'updatedFile.pdf',
      phoneNumber: '9876543210',
      status: SubmissionStatus.Submitted,
    };

    it('should update a submission successfully', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission123',
        eventEditionId: 'event123',
        title: 'Old Title',
      });

      (prismaService.userAccount.findUnique as jest.Mock)
        .mockResolvedValueOnce({
          id: 'advisor123',
          profile: Profile.Professor,
        })
        .mockResolvedValueOnce({
          id: 'author123',
        });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });

      (prismaService.submission.findFirst as jest.Mock).mockResolvedValue(null);

      (prismaService.submission.update as jest.Mock).mockResolvedValue({
        ...validUpdateSubmissionDto,
        id: 'submission123',
      });

      const result = await service.update(
        'submission123',
        validUpdateSubmissionDto,
      );

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(validUpdateSubmissionDto.title);
    });

    it('should throw error if submission not found', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.update('invalidId', {} as UpdateSubmissionDto),
      ).rejects.toThrow(new AppException('Submissão não encontrada.', 404));
    });

    it('should throw error if updating to a title that already exists', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission123',
        eventEditionId: 'event123',
        title: 'Old Title',
      });

      (prismaService.submission.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-submission',
        title: 'Updated Submission',
      });

      await expect(
        service.update('submission123', {
          title: 'Updated Submission',
        }),
      ).rejects.toThrow(
        new AppException(
          'Já existe uma submissão com o mesmo título para essa edição do evento.',
          400,
        ),
      );
    });
  });

  describe('remove', () => {
    it('should remove a submission successfully', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission123',
      });
      (prismaService.submission.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove('submission123');
      expect(result).toEqual({});
    });

    it('should throw error if submission not found for removal', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.remove('invalidId')).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });
  });
});
