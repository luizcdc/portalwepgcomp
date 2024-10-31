import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateEventRequestDTO } from './event.dto';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventRequestDTO: CreateEventRequestDTO) {
    return await this.eventService.create(createEventRequestDTO);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.eventService.getById(Number(id));
  }
}
