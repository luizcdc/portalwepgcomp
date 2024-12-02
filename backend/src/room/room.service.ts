import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AppException } from '../exceptions/app.exception';

@Injectable()
export class RoomService {
  constructor(private prismaClient: PrismaService) {}

  async create(createRoomDto: CreateRoomDto) {
    const { eventEditionId, name, description } = createRoomDto;

    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEdition) {
      throw new AppException('Evento não encontrado.', 404);
    }

    // Nao sei se pode ter duas salas com o mesmo nome no mesmo evento
    const roomWithSameName = await this.prismaClient.room.findFirst({
      where: { name, eventEditionId },
    });

    if (roomWithSameName) {
      throw new AppException(
        'Já existe uma sala com este nome neste evento.',
        400,
      );
    }

    return this.prismaClient.room.create({
      data: {
        eventEditionId: eventEditionId,
        name: name,
        description: description,
      },
    });
  }

  async findAllByEventEditionId(eventEditionId: string) {
    return this.prismaClient.room.findMany({
      where: { eventEditionId },
    });
  }

  async findOne(id: string) {
    const room = await this.prismaClient.room.findUnique({
      where: { id },
    });

    if (!room) {
      throw new AppException('Sala não encontrada.', 404);
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto) {
    const { name, eventEditionId } = updateRoomDto;

    const existingRoom = await this.prismaClient.room.findUnique({
      where: { id },
    });

    if (!existingRoom) {
      throw new AppException('Sala não encontrada.', 404);
    }

    // Nao sei se pode ter duas salas com o mesmo nome no mesmo evento
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: { id: eventEditionId },
    });

    if (!eventEdition) {
      throw new AppException('Evento não encontrado.', 404);
    }

    const roomWithSameName = await this.prismaClient.room.findFirst({
      where: { name, eventEditionId: existingRoom.eventEditionId },
    });

    if (roomWithSameName) {
      throw new AppException(
        'Já existe uma sala com esse nome neste evento.',
        400,
      );
    }

    return await this.prismaClient.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string) {
    const existingPresentation = await this.prismaClient.room.findUnique({
      where: { id },
    });
    if (!existingPresentation)
      throw new AppException('Sala não encontrada.', 404);

    await this.prismaClient.presentation.delete({
      where: { id },
    });

    return { message: 'Apresentação removida com sucesso.' };
  }
}
