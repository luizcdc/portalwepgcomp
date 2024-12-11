import { RoomService } from './room.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppException } from '../exceptions/app.exception';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

describe('RoomService', () => {
  let service: RoomService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      eventEdition: {
        findUnique: jest.fn(),
      },
      room: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      presentation: {
        delete: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new RoomService(prismaService);
  });

  describe('create', () => {
    const validCreateRoomDto: CreateRoomDto = {
      eventEditionId: 'event123',
      name: 'Test Room',
      description: 'Room description',
    };

    it('should create a room successfully', async () => {
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.room.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.room.create as jest.Mock).mockResolvedValue({
        id: 'room123',
        ...validCreateRoomDto,
      });

      const result = await service.create(validCreateRoomDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(validCreateRoomDto.name);
    });

    it('should throw an error if event edition not found', async () => {
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(service.create(validCreateRoomDto)).rejects.toThrow(
        new AppException('Evento não encontrado.', 404),
      );
    });

    it('should throw an error if room with the same name exists', async () => {
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.room.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-room',
        name: 'Test Room',
        eventEditionId: 'event123',
      });

      await expect(service.create(validCreateRoomDto)).rejects.toThrow(
        new AppException('Já existe uma sala com este nome neste evento.', 400),
      );
    });
  });

  describe('findAllByEventEditionId', () => {
    it('should return all rooms for an event edition', async () => {
      const eventEditionId = 'event123';
      const rooms = [
        { id: 'room1', name: 'Room 1', eventEditionId },
        { id: 'room2', name: 'Room 2', eventEditionId },
      ];

      (prismaService.room.findMany as jest.Mock).mockResolvedValue(rooms);

      const result = await service.findAllByEventEditionId(eventEditionId);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0].eventEditionId).toBe(eventEditionId);
    });
  });

  describe('findOne', () => {
    it('should return a room by id', async () => {
      const room = { id: 'room123', name: 'Test Room' };

      (prismaService.room.findUnique as jest.Mock).mockResolvedValue(room);

      const result = await service.findOne('room123');

      expect(result).toEqual(room);
    });

    it('should throw error if room not found', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('invalidId')).rejects.toThrow(
        new AppException('Sala não encontrada.', 404),
      );
    });
  });

  describe('update', () => {
    const validUpdateRoomDto: UpdateRoomDto = {
      name: 'Updated Room',
      eventEditionId: 'event123',
      description: 'Updated description',
    };

    it('should update a room successfully', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue({
        id: 'room123',
        eventEditionId: 'event123',
        name: 'Old Room',
      });
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.room.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.room.update as jest.Mock).mockResolvedValue({
        ...validUpdateRoomDto,
        id: 'room123',
      });

      const result = await service.update('room123', validUpdateRoomDto);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(validUpdateRoomDto.name);
    });

    it('should throw error if room not found for update', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('invalidId', validUpdateRoomDto),
      ).rejects.toThrow(new AppException('Sala não encontrada.', 404));
    });

    it('should throw error if event edition not found for update', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue({
        id: 'room123',
        eventEditionId: 'event123',
      });
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.update('room123', validUpdateRoomDto),
      ).rejects.toThrow(new AppException('Evento não encontrado.', 404));
    });

    it('should throw error if room with the same name exists for update', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue({
        id: 'room123',
        eventEditionId: 'event123',
        name: 'Old Room',
      });
      (prismaService.eventEdition.findUnique as jest.Mock).mockResolvedValue({
        id: 'event123',
      });
      (prismaService.room.findFirst as jest.Mock).mockResolvedValue({
        id: 'existing-room',
        name: 'Updated Room',
        eventEditionId: 'event123',
      });

      await expect(
        service.update('room123', validUpdateRoomDto),
      ).rejects.toThrow(
        new AppException('Já existe uma sala com esse nome neste evento.', 400),
      );
    });
  });

  describe('remove', () => {
    it('should remove a room successfully', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue({
        id: 'room123',
      });
      (prismaService.presentation.delete as jest.Mock).mockResolvedValue({});

      const result = await service.remove('room123');
      expect(result).toEqual({ message: 'Apresentação removida com sucesso.' });
    });

    it('should throw error if room not found for removal', async () => {
      (prismaService.room.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('invalidId')).rejects.toThrow(
        new AppException('Sala não encontrada.', 404),
      );
    });
  });
});
