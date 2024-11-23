import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMemberController } from './committee-member.controller';
import { CommitteeMemberService } from './committee-member.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CommitteeMemberController', () => {
  let controller: CommitteeMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeMemberController],
      providers: [
        CommitteeMemberService,
        {
          provide: PrismaService,
          useValue: {
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
          },
        },
      ],
    }).compile();

    controller = module.get<CommitteeMemberController>(
      CommitteeMemberController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
