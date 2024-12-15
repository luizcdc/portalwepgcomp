import { Test, TestingModule } from '@nestjs/testing';
import { AwardedPanelistsController } from './awarded-panelists.controller';
import { AwardedPanelistsService } from './awarded-panelists.service';

describe('PanelistAwardsController', () => {
  let controller: AwardedPanelistsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AwardedPanelistsController],
      providers: [AwardedPanelistsService],
    }).compile();

    controller = module.get<AwardedPanelistsController>(
      AwardedPanelistsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
