import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMemberService } from './committee-member.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CommitteeLevel, CommitteeRole } from '@prisma/client';

describe('CommitteeMemberService', () => {
  let service: CommitteeMemberService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    committeeMember: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    eventEdition: {
      findUnique: jest.fn(),
    },
    userAccount: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommitteeMemberService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommitteeMemberService>(CommitteeMemberService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateCommitteeMemberDto = {
      eventEditionId: 'event-123',
      userId: 'user-123',
      level: CommitteeLevel.Coordinator,
      role: CommitteeRole.OrganizingCommittee,
    };

    it('should create a committee member', async () => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'event-123' });
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'user-123' });
      prismaService.committeeMember.create = jest
        .fn()
        .mockResolvedValue(createDto);

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining(createDto));
      expect(prismaService.committeeMember.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should throw BadRequestException if event edition not found', async () => {
      prismaService.eventEdition.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if user not found', async () => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'event-123' });
      prismaService.userAccount.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if creation fails', async () => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'event-123' });
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'user-123' });
      prismaService.committeeMember.create = jest.fn().mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of committee members', async () => {
      const expectedResult = [{ id: '1' }, { id: '2' }];
      prismaService.committeeMember.findMany = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult.map(expect.objectContaining));
    });
  });

  describe('findOne', () => {
    it('should return a committee member if found', async () => {
      const expectedResult = { id: '1' };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(expectedResult);

      const result = await service.findOne('1');

      expect(result).toEqual(expect.objectContaining(expectedResult));
    });

    it('should throw NotFoundException if committee member not found', async () => {
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.findOne('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateDto: UpdateCommitteeMemberDto = {
      level: CommitteeLevel.Committee,
      role: CommitteeRole.OrganizingCommittee,
    };

    it('should update a committee member', async () => {
      const existingMember = { id: '1', ...updateDto };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(existingMember);
      prismaService.committeeMember.update = jest
        .fn()
        .mockResolvedValue(existingMember);

      const result = await service.update('1', updateDto);

      expect(result).toEqual(expect.objectContaining(existingMember));
      expect(prismaService.committeeMember.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
      });
    });

    it('should throw NotFoundException if committee member not found', async () => {
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a committee member', async () => {
      const existingMember = { id: '1' };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(existingMember);
      prismaService.committeeMember.delete = jest
        .fn()
        .mockResolvedValue(existingMember);

      const result = await service.remove('1');

      expect(result).toEqual(expect.objectContaining(existingMember));
      expect(prismaService.committeeMember.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if committee member not found', async () => {
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
