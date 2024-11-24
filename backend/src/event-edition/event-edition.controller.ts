import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventEditionService } from './event-edition.service';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/upddate-event-edition.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { UserLevelGuard } from '../auth/guards/user-level.guard';
import { UserLevel } from '@prisma/client';
import { UserLevels } from '../auth/decorators/user-level.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('event')
@UseGuards(JwtAuthGuard, UserLevelGuard)
export class EventEditionController {
  constructor(private readonly eventEditionService: EventEditionService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventEditionDto) {
    return await this.eventEditionService.create(createEventDto);
  }

  @Get()
  @UserLevels(UserLevel.Superadmin)
  async getAll() {
    return await this.eventEditionService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.eventEditionService.getById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventRequestDTO: UpdateEventEditionDto,
  ) {
    return await this.eventEditionService.update(id, updateEventRequestDTO);
  }

  @Patch('active/:id')
  async setActive(@Param('id') id: string) {
    return await this.eventEditionService.setActive(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.eventEditionService.delete(id);
  }
}
