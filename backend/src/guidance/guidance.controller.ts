import {
  Controller,
  Get,
  Body,
  Delete,
  Post,
  Param,
  Put,
} from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { CreateGuidanceDto } from './dto/create-guidance.dto';

@Controller('guidance')
export class GuidanceController {
  constructor(private readonly guidanceService: GuidanceService) {}

  @Get()
  async getGuidance() {
    return this.guidanceService.getActiveInstance();
  }

  @Get(':id')
  async getGuidanceById(@Param('id') id: string) {
    return this.guidanceService.getById(id);
  }

  @Delete(':id')
  async deleteGuidance(@Param('id') id: string) {
    return this.guidanceService.remove(id);
  }

  @Post()
  async createGuidance(@Body() createGuidanceDto: CreateGuidanceDto) {
    return this.guidanceService.create(createGuidanceDto);
  }

  @Put('/active')
  async updateActiveGuidance(@Body() updateGuidanceDto: UpdateGuidanceDto) {
    return this.guidanceService.updateActive(updateGuidanceDto);
  }

  @Put(':id')
  async updateGuidance(
    @Param('id') id: string,
    @Body() updateGuidanceDto: UpdateGuidanceDto,
  ) {
    return this.guidanceService.update(id, updateGuidanceDto);
  }
}
