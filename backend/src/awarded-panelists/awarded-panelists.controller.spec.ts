import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsController } from './awarded-panelists.controller';
import { AwardedPanelistsService } from './awarded-panelists.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PanelistAwardsController', () => {
  let controller: AwardedPanelistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardedPanelistsController],
      providers: [
        AwardedPanelistsService,
        {
          provide: PrismaService,
          useValue: {
            // Mock PrismaService methods as necessary
            awardedPanelists: {
              findMany: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<AwardedPanelistsController>(
      AwardedPanelistsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
