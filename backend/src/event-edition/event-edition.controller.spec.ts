import { Test, TestingModule } from '@nestjs/testing';
import { EventEditionController } from './event-edition.controller';
import { EventEditionService } from './event-edition.service';
import { CreateEventEditionDto } from './dto/create-event-edition.dto';
import { UpdateEventEditionDto } from './dto/update-event-edition.dto';
import { EventEditionResponseDto } from './dto/event-edition-response';

describe('EventEditionController', () => {
  let controller: EventEditionController;
  let service: EventEditionService;

  const mockEventEditionService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    setActive: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventEditionController],
      providers: [
        {
          provide: EventEditionService,
          useValue: mockEventEditionService,
        },
      ],
    }).compile();

    controller = module.get<EventEditionController>(EventEditionController);
    service = module.get<EventEditionService>(EventEditionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call service.create with the correct arguments', async () => {
      const createDto = new CreateEventEditionDto();
      Object.assign(createDto, {
        name: 'Event 1',
        description: 'Description 1',
        url: 'https://example.com',
      });
      const createdEvent = new EventEditionResponseDto({
        id: '1',
        ...createDto,
      });

      jest.spyOn(service, 'create').mockResolvedValue(createdEvent);

      const result = await controller.create(createDto);
      expect(result).toEqual(createdEvent);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('getAll', () => {
    it('should return a list of events', async () => {
      const events = [
        new EventEditionResponseDto({ id: '1', name: 'Event 1' }),
        new EventEditionResponseDto({ id: '2', name: 'Event 2' }),
      ];

      jest.spyOn(service, 'getAll').mockResolvedValue(events);

      const result = await controller.getAll();
      expect(result).toEqual(events);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('should return a single event by id', async () => {
      const event = new EventEditionResponseDto({ id: '1', name: 'Event 1' });

      jest.spyOn(service, 'getById').mockResolvedValue(event);

      const result = await controller.getById('1');
      expect(result).toEqual(event);
      expect(service.getById).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should call service.update with correct arguments', async () => {
      const updateDto = new UpdateEventEditionDto();
      Object.assign(updateDto, { name: 'Updated Event' });
      const updatedEvent = new EventEditionResponseDto({
        id: '1',
        name: 'Updated Event',
      });

      jest.spyOn(service, 'update').mockResolvedValue(updatedEvent);

      const result = await controller.update('1', updateDto);
      expect(result).toEqual(updatedEvent);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });
  });

  describe('setActive', () => {
    it('should call service.setActive with correct id', async () => {
      const activeEvent = new EventEditionResponseDto({
        id: '1',
        isActive: true,
      });

      jest.spyOn(service, 'setActive').mockResolvedValue(activeEvent);

      const result = await controller.setActive('1');
      expect(result).toEqual(activeEvent);
      expect(service.setActive).toHaveBeenCalledWith('1');
    });
  });

  describe('delete', () => {
    it('should call service.delete with correct id', async () => {
      const deletedEvent = new EventEditionResponseDto({
        id: '1',
        name: 'Event 1',
      });

      jest.spyOn(service, 'delete').mockResolvedValue(deletedEvent);

      const result = await controller.delete('1');
      expect(result).toEqual(deletedEvent);
      expect(service.delete).toHaveBeenCalledWith('1');
    });
  });
});
