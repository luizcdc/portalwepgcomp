import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateGuidanceDto } from './dto/update-guidance.dto';
import { ResponseGuidanceDto } from './dto/response-guidance.dto';
import { EventEditionService } from '../event-edition/event-edition.service';
import { AppException } from '../exceptions/app.exception';
import { CreateGuidanceDto } from './dto/create-guidance.dto';

@Injectable()
export class GuidanceService {
  constructor(
    private readonly prismaClient: PrismaService,
    private readonly eventEditionService: EventEditionService,
  ) {}

  async getActiveInstance() {
    const eventEditionActive = await this.eventEditionService.findActive();

    const instance = await this.prismaClient.guidance.findFirst({
      where: {
        eventEditionId: eventEditionActive.id,
      },
    });
    if (!instance) {
      throw new AppException(
        'Não existe orientação ativa para a edição do evento.',
        404,
      );
    }

    const responseInstance = new ResponseGuidanceDto(instance);
    return responseInstance;
  }

  async getById(id: string) {
    const guidance = await this.prismaClient.guidance.findUnique({
      where: {
        id,
      },
    });

    if (!guidance) {
      throw new AppException('Instância de orientação não encontrada.', 404);
    }

    const responseInstance = new ResponseGuidanceDto(guidance);
    return responseInstance;
  }

  async remove(id: string) {
    const guidanceExists = await this.prismaClient.guidance.findUnique({
      where: {
        id,
      },
    });

    if (!guidanceExists) {
      throw new AppException('Instância de orientação não encontrada.', 404);
    }

    await this.prismaClient.guidance.delete({
      where: {
        id,
      },
    });

    return { message: 'Instância de orientação removida com sucesso.' };
  }

  async create(createGuidanceDto: CreateGuidanceDto) {
    const eventEditionActive = await this.eventEditionService.findActive();

    const existingGuidance = await this.prismaClient.guidance.findFirst({
      where: {
        eventEditionId: eventEditionActive.id,
      },
    });
    if (existingGuidance) {
      return await this.update(existingGuidance.id, createGuidanceDto);
    }

    const createGuidance = await this.prismaClient.guidance.create({
      data: {
        ...createGuidanceDto,
        eventEditionId: eventEditionActive.id,
      },
    });

    const responseInstance = new ResponseGuidanceDto(createGuidance);
    return responseInstance;
  }

  async update(id: string, updateGuidanceDto: UpdateGuidanceDto) {
    const guidanceExists = await this.prismaClient.guidance.findUnique({
      where: {
        id,
      },
    });

    if (!guidanceExists) {
      throw new AppException('Instância de orientação não encontrada.', 404);
    }

    const updateGuidance = await this.prismaClient.guidance.update({
      where: {
        id,
      },
      data: updateGuidanceDto,
    });

    const responseInstance = new ResponseGuidanceDto(updateGuidance);
    return responseInstance;
  }

  async updateActive(updateGuidanceDto: UpdateGuidanceDto) {
    const instance = await this.getActiveInstance();
    return this.prismaClient.guidance.update({
      where: { id: instance.id },
      data: updateGuidanceDto,
    });
  }
}
