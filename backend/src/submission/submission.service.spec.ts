import { Test, TestingModule } from '@nestjs/testing';
import { SubmissionService } from './submission.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { SubmissionStatus } from '@prisma/client';

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
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      coAuthor: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    } as unknown as PrismaService;
    
    service = new SubmissionService(prismaService);
  });

  describe('create', () => {
    it('should create a submission successfully', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        advisorId: 'advisor123',
        mainAuthorId: 'author123',
        eventEditionId: 'event123',
        title: 'Test Submission',
        abstract: 'Abstract of the submission',
        pdfFile: 'file.pdf',
        phoneNumber: '1234567890',
        status: SubmissionStatus.Submitted,
        coAuthors: [],
      };

      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'advisor123' },
        { id: 'author123' },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({ id: 'event123' });
      (prismaService.submission.create as jest.Mock).mockResolvedValue({
        ...createSubmissionDto,
        id: 'submission123',
      });

      const result = await service.create(createSubmissionDto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(createSubmissionDto.title);
    });

    it('should throw an error when mainAuthorId does not exist', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        advisorId: 'advisor-id',
        mainAuthorId: 'invalid-main-author-id',
        eventEditionId: 'event-edition-id',
        title: 'Test Submission',
        abstract: 'Test Abstract',
        pdfFile: 'pdf-file.pdf',
        phoneNumber: '123456789',
        linkedinUrl: 'https://linkedin.com/in/test',
        status: SubmissionStatus.Submitted,
        coAuthors: [],
      };

      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([]);

      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([{ id: 'advisor-id' }]);
 
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({ id: 'event-edition-id' });
    
      await expect(service.create(createSubmissionDto))
        .rejects
        .toThrowError(new AppException('Autor principal não encontrado.', 404));
    });

    it('should throw error if advisor not found', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        advisorId: 'invalidAdvisor',
        mainAuthorId: 'author123',
        eventEditionId: 'event123',
        title: 'Test Submission',
        abstract: 'Abstract of the submission',
        pdfFile: 'file.pdf',
        phoneNumber: '1234567890',
        status: SubmissionStatus.Submitted,
        coAuthors: [],
      };

      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([{ id: 'author123' }]);

      await expect(service.create(createSubmissionDto)).rejects.toThrow(
        new AppException('Orientador não encontrado.', 404),
      );
    });

    it('should throw error if event edition not found', async () => {
      const createSubmissionDto: CreateSubmissionDto = {
        advisorId: 'advisor123',
        mainAuthorId: 'author123',
        eventEditionId: 'invalidEvent',
        title: 'Test Submission',
        abstract: 'Abstract of the submission',
        pdfFile: 'file.pdf',
        phoneNumber: '1234567890',
        status: SubmissionStatus.Submitted,
        coAuthors: [],
      };

      (prismaService.userAccount.findMany as jest.Mock).mockResolvedValue([
        { id: 'advisor123' },
        { id: 'author123' },
      ]);
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createSubmissionDto)).rejects.toThrow(
        new AppException('Edição do evento não encontrada.', 404),
      );
    });
  });

  describe('findOne', () => {
    it('should find a submission by id', async () => {
      const submission = { id: 'submission123', title: 'Test Submission' };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(submission);

      const result = await service.findOne('submission123');
      expect(result).toEqual(submission);
    });

    it('should throw error if submission not found', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('invalidId')).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });
  });

  describe('update', () => {
    it('should update a submission successfully', async () => {
      const updateSubmissionDto: UpdateSubmissionDto = {
        advisorId: 'advisor123',
        mainAuthorId: 'author123',
        eventEditionId: 'event123',
        title: 'Updated Submission',
        abstract: 'Updated abstract',
        pdfFile: 'updatedFile.pdf',
        phoneNumber: '9876543210',
        status: SubmissionStatus.Submitted,
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({
        id: 'submission123',
        title: 'Old Title',
      });

      (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue({ id: 'advisor123' });
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({ id: 'event123' });
      (prismaService.submission.update as jest.Mock).mockResolvedValue({
        ...updateSubmissionDto,
        id: 'submission123',
      });

      const result = await service.update('submission123', updateSubmissionDto);
      expect(result).toHaveProperty('id');
      expect(result.title).toBe(updateSubmissionDto.title);
    });

    it('should throw error if submission not found', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('invalidId', {} as UpdateSubmissionDto)).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });

    it('should throw an error when mainAuthorId does not exist', async () => {
      const updateSubmissionDto = {
        mainAuthorId: 'invalid-main-author-id',
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: 'submission-id' });

      (prismaService.userAccount.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)

      await expect(service.update('submission-id', updateSubmissionDto as UpdateSubmissionDto))
        .rejects.toThrowError(new AppException('Autor principal não encontrado.', 404));
    });
    
    it('should throw error if advisor not found', async () => {
      const updateSubmissionDto: UpdateSubmissionDto = {
        advisorId: 'invalidAdvisor',
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: 'submission123' });

      (prismaService.userAccount.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('submission123', updateSubmissionDto)).rejects.toThrow(
        new AppException('Orientador não encontrado.', 404),
      );
    });

    it('should throw error if event edition not found', async () => {
      const updateSubmissionDto: UpdateSubmissionDto = {
        eventEditionId: 'invalidEvent',
      };

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: 'submission123' });

      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('submission123', updateSubmissionDto)).rejects.toThrow(
        new AppException('Edição do evento não encontrada.', 404),
      );
    });
  });

  describe('updateCoAuthors', () => {
    it('should update co-authors successfully', async () => {
      const coAuthors = [{ name: 'Co-author 1', institution: 'University 1' }];
      const submissionId = 'submission123';

      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: submissionId });
      (prismaService.coAuthor.deleteMany as jest.Mock).mockResolvedValue({ count: 1 });
      (prismaService.coAuthor.createMany as jest.Mock).mockResolvedValue({ count: 1 });

      const result = await service.updateCoAuthors(submissionId, coAuthors);
      expect(result.count).toBeGreaterThan(0);
    });

    it('should throw error if submission not found for co-authors', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.updateCoAuthors('invalidId', [])).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });
  });

  describe('remove', () => {
    it('should remove a submission successfully', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue({ id: 'submission123' });
      (prismaService.submission.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove('submission123');
      expect(result).toHaveProperty('message');
      expect(result.message).toBe('Apresentação removida com sucesso.');
    });

    it('should throw error if submission not found for removal', async () => {
      (prismaService.submission.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('invalidId')).rejects.toThrow(
        new AppException('Submissão não encontrada.', 404),
      );
    });
  });
});
