import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { PresentationBlockService } from './presentation-block.service';
import { CreatePresentationBlockDto } from './dto/create-presentation-block.dto';
import { UpdatePresentationBlockDto } from './dto/update-presentation-block.dto';
import { ResponsePresentationBlockDto } from './dto/response-presentation-block.dto';
import { SwapMltiplePresentationsDto, SwapPresentationsDto } from './dto/swap-presentations.dto';

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
    const presentationBlocks = await this.presentationBlockService.findAll(
      undefined,
      eventEditionId,
    );

    return Promise.all(
      presentationBlocks.map((block) =>
        ResponsePresentationBlockDto.create(block, (id) => this.userLoader(id)),
      ),
    );
  }

  @UserLevels(UserLevel.Superadmin, UserLevel.Admin, UserLevel.Default)
  @Get()
  async findAll(
    @Request() req: any,
    @Query('eventEditionId') eventEditionId: string,
    @Query('panelistId') panelistId?: string,
  ): Promise<ResponsePresentationBlockDto[]> {
    const presentationBlocks = await this.presentationBlockService.findAll(
      req.user.userId,
      eventEditionId,
      panelistId,
    );

    return Promise.all(
      presentationBlocks.map((block) =>
        ResponsePresentationBlockDto.create(block, (id) => this.userLoader(id)),
      ),
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

    return ResponsePresentationBlockDto.create(presentationBlock, (id) =>
      this.userLoader(id),
    );
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
    @Body() swapMltiplePresentationsDto: SwapMltiplePresentationsDto,
  ) {
    return await this.presentationBlockService.swapPresentations(
      id,
      swapMltiplePresentationsDto,
    );
  }

  async userLoader(
    userId: string,
  ): Promise<{ id: string; name: string; email: string }> {
    const user = await this.presentationBlockService.findUserById(userId);
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  }
}
