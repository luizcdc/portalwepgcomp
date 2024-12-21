import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PresentationBlockService } from './presentation-block.service';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { ResponsePresentationBlockDto } from './dto/response-presentation-block.dto';
import { SwapPresentationsDto } from './dto/swap-presentations.dto';

import { Public, UserLevels } from '../auth/decorators/user-level.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';

@Controller('presentation-block')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class PresentationBlockController {
  constructor(
    private readonly presentationBlockService: PresentationBlockService,
  ) {}

  @Post()
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
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
    // try exception
    let presentationBlock = null;
    try {
      presentationBlock = await this.presentationBlockService.findOne(id);
    } catch (error) {
      return null;
    }

    if (!presentationBlock) {
      return null;
    }

    return new ResponsePresentationBlockDto(presentationBlock);
  }

  @Patch(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async update(
    @Param('id') id: string,
    @Body() updatePresentationBlockDto: UpdatePresentationBlockDto,
  ) {
    return this.presentationBlockService.update(id, updatePresentationBlockDto);
  }

  @Delete(':id')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async remove(@Param('id') id: string) {
    return this.presentationBlockService.remove(id);
  }

  @Patch(':id/presentations/swap')
  @UserLevels(UserLevel.Superadmin, UserLevel.Admin)
  async swapPresentations(
    @Param('id') id: string,
    @Body() swapPresentationsDto: SwapPresentationsDto,
  ) {
    return await this.presentationBlockService.swapPresentations(
      id,
      swapPresentationsDto,
    );
  }
}
