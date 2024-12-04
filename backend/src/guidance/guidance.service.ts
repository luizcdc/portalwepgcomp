import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { ResponseGuidanceDto } from './dto/response-guidance.dto';

@Injectable()
export class GuidanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getUniqueInstance() {
    const instance = await this.prisma.guidance.findFirst();
    if (!instance) {
      return this.prisma.guidance.create({
        data: {
          summary: '',
          authorGuidance: '',
          reviewerGuidance: '',
          audienceGuidance: '',
        },
      });
    }
    const response_instance = new ResponseGuidanceDto(instance);
    return response_instance;
  }

  async update(updateGuidanceDto: UpdateGuidanceDto) {
    const instance = await this.getUniqueInstance();
    return this.prisma.guidance.update({
      where: { id: instance.id },
      data: updateGuidanceDto,
    });
  }
}
