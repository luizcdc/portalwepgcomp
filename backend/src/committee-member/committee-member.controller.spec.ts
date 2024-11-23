import { Test, TestingModule } from '@nestjs/testing';
import { CommitteeMemberController } from './committee-member.controller';
import { CommitteeMemberService } from './committee-member.service';

describe('CommitteeMemberController', () => {
  let controller: CommitteeMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteeMemberController],
      providers: [CommitteeMemberService],
    }).compile();

    controller = module.get<CommitteeMemberController>(
      CommitteeMemberController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
