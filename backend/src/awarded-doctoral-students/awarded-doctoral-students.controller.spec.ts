import { Test, TestingModule } from '@nestjs/testing';
import { AwardedDoctoralStudentsController } from './awarded-doctoral-students.controller';
import { AwardedDoctoralStudentsService } from './awarded-doctoral-students.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AwardedDoctoralStudentsController', () => {
  let controller: AwardedDoctoralStudentsController;

  beforeEach(async () => {
    const mockPrismaService = {
      awardedDoctoralStudents: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    };

    const mockAwardedDoctoralStudentsService = {
      findAll: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardedDoctoralStudentsController],
      providers: [
        {
          provide: AwardedDoctoralStudentsService,
          useValue: mockAwardedDoctoralStudentsService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<AwardedDoctoralStudentsController>(
      AwardedDoctoralStudentsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
