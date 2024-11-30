import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMemberController } from './committee-member.controller';
import { CommitteeMemberService } from './committee-member.service';
import { CreateCommitteeMemberDto } from './dto/create-committee-member.dto';
import { UpdateCommitteeMemberDto } from './dto/update-committee-member.dto';
import { CommitteeLevel, CommitteeRole } from '@prisma/client';

describe('CommitteeMemberController', () => {
  let controller: CommitteeMemberController;
  let service: CommitteeMemberService;

  const mockCommitteeMemberService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeMemberController],
      providers: [
        {
          provide: CommitteeMemberService,
          useValue: mockCommitteeMemberService,
        },
      ],
    }).compile();

    controller = module.get<CommitteeMemberController>(
      CommitteeMemberController,
    );
    service = module.get<CommitteeMemberService>(CommitteeMemberService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a committee member', async () => {
      const createDto: CreateCommitteeMemberDto = {
        eventEditionId: 'event-123',
        userId: 'user-123',
        level: CommitteeLevel.Coordinator,
        role: CommitteeRole.OrganizingCommittee,
      };
      const expectedResult = { id: '1', ...createDto };

      mockCommitteeMemberService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of committee members', async () => {
      const allCommitteeMembers = [
        { id: '1', eventEditionId: '1' },
        { id: '3', eventEditionId: '1' },
        { id: '2', eventEditionId: '2' },
      ];
      const expectedResult = [
        { id: '1', eventEditionId: '1' },
        { id: '3', eventEditionId: '1' },
      ];
      mockCommitteeMemberService.findAll.mockImplementation(
        (eventEditionId: string) =>
          Promise.resolve(
            allCommitteeMembers.filter(
              (member) => member.eventEditionId === eventEditionId,
            ),
          ),
      );

      const result = await controller.findAll('1');

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith('1');
    });
  });

  describe('findOne', () => {
    it('should return a committee member if found', async () => {
      const expectedResult = { id: '1' };
      mockCommitteeMemberService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne('1');

      expect(result).toEqual(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a committee member', async () => {
      const updateDto: UpdateCommitteeMemberDto = {
        level: CommitteeLevel.Committee,
        role: CommitteeRole.StudentVolunteers,
      };
      const expectedResult = { id: '1', ...updateDto };
      mockCommitteeMemberService.update.mockResolvedValue(expectedResult);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('updateByUserAndEvent', () => {
    it('should update a committee member by userId and eventEditionId', async () => {
      const updateDto: UpdateCommitteeMemberDto = {
        level: CommitteeLevel.Committee,
        role: CommitteeRole.StudentVolunteers,
      };
      const expectedResult = { id: '1', ...updateDto };
      mockCommitteeMemberService.update.mockResolvedValue(expectedResult);

      const result = await controller.updateByUserAndEvent(
        'user-123',
        'event-123',
        updateDto,
      );

      expect(result).toEqual(expectedResult);
      expect(service.update).toHaveBeenCalledWith(
        null,
        updateDto,
        'user-123',
        'event-123',
      );
    });
  });

  describe('remove', () => {
    it('should remove a committee member by id', async () => {
      const expectedResult = { id: '1' };
      mockCommitteeMemberService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove('1');

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should remove a committee member by userId and eventEditionId', async () => {
      const expectedResult = { id: '1' };
      mockCommitteeMemberService.remove.mockResolvedValue(expectedResult);

      const result = await controller.removeByUserAndEvent(
        'user-123',
        'event-123',
      );

      expect(result).toEqual(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(
        null,
        'user-123',
        'event-123',
      );
    });
  });
});
