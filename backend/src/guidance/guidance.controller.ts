import { Controller, Get, Patch, Body } from '@nestjs/common';
import { GuidanceService } from './guidance.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';

@Controller('guidance')
export class GuidanceController {
  constructor(private readonly guidanceService: GuidanceService) {}

  @Get()
  async getGuidance() {
    return this.guidanceService.getUniqueInstance();
  }

  @Patch()
  async updateGuidance(@Body() updateGuidanceDto: UpdateGuidanceDto) {
    return this.guidanceService.update(updateGuidanceDto);
  }
}
