import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { EventEditionService } from './event-edition.service';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/update-event-edition.dto';

@Controller('event')
export class EventEditionController {
  constructor(private readonly eventEditionService: EventEditionService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventEditionDto) {
    return await this.eventEditionService.create(createEventDto);
  }

  @Get()
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
