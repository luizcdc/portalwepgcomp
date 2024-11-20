import { Module } from '@nestjs/common';
import { PresentationBlockService } from './presentation-block.service';
import { PresentationBlockController } from './presentation-block.controller';

@Module({
  controllers: [PresentationBlockController],
  providers: [PresentationBlockService],
})
export class PresentationBlockModule {}
