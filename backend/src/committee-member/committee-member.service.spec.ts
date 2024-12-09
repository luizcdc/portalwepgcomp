import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMemberService } from './committee-member.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CommitteeLevel, CommitteeRole, UserLevel } from '@prisma/client';
import { use } from 'passport';

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
      findFirst: jest.fn(),
    },
    eventEdition: {
      findUnique: jest.fn(),
    },
    userAccount: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
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
      prismaService.userAccount.update = jest.fn().mockResolvedValue(null);
      prismaService.committeeMember.findFirst = jest.fn().mockResolvedValue({
        id: '1',
      });
      prismaService.$transaction = jest.fn().mockImplementation((callback) => {
        return callback(prismaService);
      });

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
      prismaService.userAccount.update = jest.fn().mockResolvedValue(null);
      prismaService.committeeMember.create = jest.fn().mockResolvedValue(null);
      prismaService.committeeMember.findFirst = jest.fn().mockResolvedValue({
        id: '1',
      });
      // mock $transaction and the callback function
      prismaService.$transaction = jest.fn().mockImplementation((callback) => {
        return callback(prismaService);
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should promote user when creating a committee member', async () => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'event-123' });
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'user-123' });
      prismaService.committeeMember.create = jest
        .fn()
        .mockResolvedValue(createDto);
      prismaService.userAccount.update = jest.fn().mockResolvedValue(null);
      prismaService.committeeMember.findFirst = jest.fn().mockResolvedValue({
        id: '1',
      });
      prismaService.$transaction = jest.fn().mockImplementation((callback) => {
        return callback(prismaService);
      });

      await service.create(createDto);

      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { level: UserLevel.Superadmin },
      });
    });

    it('should handle concurrency by checking for existing coordinator', async () => {
      prismaService.eventEdition.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'event-123' });
      prismaService.userAccount.findUnique = jest
        .fn()
        .mockResolvedValue({ id: 'user-123' });
      prismaService.committeeMember.create = jest
        .fn()
        .mockResolvedValue(createDto);
      prismaService.userAccount.update = jest.fn().mockResolvedValue(null);
      prismaService.committeeMember.findFirst = jest.fn().mockResolvedValue({
        id: '1',
      });
      prismaService.committeeMember.delete = jest.fn().mockResolvedValue(null);
      prismaService.$transaction = jest.fn().mockImplementation((callback) => {
        return callback(prismaService);
      });

      await service.create(createDto);

      expect(prismaService.committeeMember.findFirst).toHaveBeenCalledWith({
        where: {
          eventEditionId: 'event-123',
          level: CommitteeLevel.Coordinator,
        },
      });
      expect(prismaService.committeeMember.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of committee members', async () => {
      const queryReturn = [
        {
          id: '1',
          eventEditionId: '1',
          userId: '2',
          user: { name: 'John' },
          level: 'Coordinator',
          role: 'OrganizingCommittee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          eventEditionId: '1',
          userId: '2',
          user: { id: '2', name: 'Doe' },
          level: 'Member',
          role: 'OrganizingCommittee',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const expectedResult = [
        {
          id: '1',
          eventEditionId: '1',
          userId: '2',
          level: 'Coordinator',
          role: 'OrganizingCommittee',
          createdAt: new Date(),
          updatedAt: new Date(),
          userName: 'John',
        },
        {
          id: '3',
          eventEditionId: '1',
          userId: '2',
          level: 'Member',
          role: 'OrganizingCommittee',
          createdAt: new Date(),
          updatedAt: new Date(),
          userName: 'Doe',
        },
      ];
      prismaService.committeeMember.findMany = jest
        .fn()
        .mockResolvedValue(queryReturn);

      const result = await service.findAll('1');

      expect(result).toEqual(expectedResult.map(expect.objectContaining));
    });
  });

  describe('findOne', () => {
    it('should return a committee member if found', async () => {
      const expectedResult = { id: '1' };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue({ ...expectedResult, user: { name: 'John' } });

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
        .mockResolvedValue({ ...existingMember, user: { name: 'John' } });
      prismaService.committeeMember.update = jest
        .fn()
        .mockResolvedValue({ ...existingMember, user: { name: 'John' } });

      const result = await service.update('1', updateDto);

      expect(result).toEqual(expect.objectContaining(existingMember));
      expect(prismaService.committeeMember.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
        include: { user: true },
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

  describe('updateByUserAndEvent', () => {
    const updateDto: UpdateCommitteeMemberDto = {
      level: CommitteeLevel.Committee,
      role: CommitteeRole.OrganizingCommittee,
    };

    it('should update a committee member by userId and eventEditionId', async () => {
      const existingMember = { id: '1', ...updateDto };
      prismaService.committeeMember.findFirst = jest
        .fn()
        .mockResolvedValue({ ...existingMember, user: { name: 'John' } });
      prismaService.committeeMember.update = jest
        .fn()
        .mockResolvedValue({ ...existingMember, user: { name: 'John' } });

      const result = await service.update(
        null,
        updateDto,
        'user-123',
        'event-123',
      );

      expect(result).toEqual(expect.objectContaining(existingMember));
      expect(prismaService.committeeMember.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto,
        include: { user: true },
      });
    });

    it('should throw NotFoundException if committee member not found by userId and eventEditionId', async () => {
      prismaService.committeeMember.findFirst = jest
        .fn()
        .mockResolvedValue(null);

      await expect(
        service.update(null, updateDto, 'user-123', 'event-123'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a committee member', async () => {
      const existingMember = {
        id: '1',
        eventEditionId: '1',
        userId: '1',
        level: CommitteeLevel.Committee,
        role: CommitteeRole.OrganizingCommittee,
      };
      const existingUser = { id: '1', level: UserLevel.Admin };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(existingMember);
      prismaService.committeeMember.delete = jest
        .fn()
        .mockResolvedValue(existingMember);

      prismaService.committeeMember.findFirst = jest
        .fn()
        .mockResolvedValue(existingMember);

      prismaService.userAccount.update = jest
        .fn()
        .mockResolvedValue(existingUser);

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
      prismaService.committeeMember.findFirst = jest
        .fn()
        .mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should demote user when removing a committee member', async () => {
      const existingMember = {
        id: '1',
        eventEditionId: '1',
        userId: '1',
        level: CommitteeLevel.Committee,
        role: CommitteeRole.OrganizingCommittee,
      };
      const existingUser = { id: '1', level: UserLevel.Admin };
      prismaService.committeeMember.findUnique = jest
        .fn()
        .mockResolvedValue(existingMember);
      prismaService.committeeMember.delete = jest
        .fn()
        .mockResolvedValue(existingMember);

      prismaService.committeeMember.findFirst = jest
        .fn()
        .mockResolvedValue(existingMember);

      prismaService.userAccount.update = jest
        .fn()
        .mockResolvedValue(existingUser);

      await service.remove('1');

      expect(prismaService.userAccount.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { level: UserLevel.Default },
      });
    });
  });
});
