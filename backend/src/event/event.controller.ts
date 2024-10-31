import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateEventRequestDTO, UpdateEventRequestDTO } from './event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventRequestDTO: CreateEventRequestDTO) {
    return await this.eventService.create(createEventRequestDTO);
  }

  @Get()
  async getAll() {
    return await this.eventService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.eventService.getById(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventRequestDTO: UpdateEventRequestDTO,
  ) {
    return await this.eventService.update(Number(id), updateEventRequestDTO);
  }
}
