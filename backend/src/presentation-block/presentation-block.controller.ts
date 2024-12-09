import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PresentationBlockService } from './presentation-block.service';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { ResponsePresentationBlockDto } from './dto/response-presentation-block.dto';
import { Public } from 'src/auth/decorators/user-level.decorator';

@Controller('presentation-block')
export class PresentationBlockController {
  constructor(
    private readonly presentationBlockService: PresentationBlockService,
  ) {}

  @Post()
  async create(@Body() createPresentationBlockDto: CreatePresentationBlockDto) {
    return this.presentationBlockService.create(createPresentationBlockDto);
  }

  // FindAll but for only a given eventEditionId
  @Public()
  @Get('event-edition/:eventEditionId')
  async findAllByEventEditionId(
    @Param('eventEditionId') eventEditionId: string,
  ): Promise<ResponsePresentationBlockDto[]> {
    const presentationBlocks =
      await this.presentationBlockService.findAllByEventEditionId(
        eventEditionId,
      );

    return presentationBlocks.map(
      (block) => new ResponsePresentationBlockDto(block),
    );
  }

  @Public()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ResponsePresentationBlockDto> {
    const presentationBlock = await this.presentationBlockService.findOne(id);

    return new ResponsePresentationBlockDto(presentationBlock);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePresentationBlockDto: UpdatePresentationBlockDto,
  ) {
    return this.presentationBlockService.update(id, updatePresentationBlockDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.presentationBlockService.remove(id);
  }
}
