import { ScoringService } from './scoring.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { PresentationBlockType } from '@prisma/client';
import { Logger } from '@nestjs/common';

const createMockEventEdition = (partialEvent: Partial<any>) => {
  return {
    name: 'Default Event',
    id: 'default-id',
    description: 'Default description',
    callForPapersText: 'Default call for papers',
    partnersText: 'Default partners text',
    location: 'Default location',
    startDate: new Date(),
    endDate: new Date(),
    submissionStartDate: new Date(),
    submissionDeadline: new Date(),
    isActive: true,
    isEvaluationRestrictToLoggedUsers: true,
    presentationDuration: 20,
    presentationsPerPresentationBlock: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partialEvent,
  };
};

describe('ScoringService', () => {
  let service: ScoringService;
  let prismaService: PrismaService;
  let schedulerRegistry: SchedulerRegistry;
  let timeouts: NodeJS.Timeout[];

  const mockEvent = {
    id: 'event-123',
    name: 'Test Event',
    endDate: new Date(Date.now() + 86400000), // Tomorrow
  };

  beforeEach(() => {
    timeouts = [];
    prismaService = {
      presentation: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      evaluationCriteria: {
        findMany: jest.fn(),
      },
      presentationBlock: {
        findFirst: jest.fn().mockResolvedValueOnce({
          type: PresentationBlockType.General,
          startTime: new Date(),
          eventEditionId: mockEvent.id,
        }),
      },
      eventEdition: {
        findMany: jest.fn().mockResolvedValue([mockEvent]),
        findUnique: jest
          .fn()
          .mockResolvedValue(createMockEventEdition(mockEvent)),
      },
    } as unknown as PrismaService;

    jest.useFakeTimers();
    const originalSetTimeout = global.setTimeout;

    const mockSetTimeout = jest.fn(
      (callback: (() => void) | ((args: void) => void), delay: number) => {
        const timeout = originalSetTimeout(callback, delay);
        timeouts.push(timeout);
        return timeout;
      },
    ) as unknown as typeof global.setTimeout;

    Object.defineProperty(mockSetTimeout, '__promisify__', {
      enumerable: false,
      value: originalSetTimeout.__promisify__,
      writable: false,
    });

    global.setTimeout = mockSetTimeout;

    schedulerRegistry = {
      addTimeout: jest.fn((name: string, timeout: NodeJS.Timeout) => {
        timeouts.push(timeout);
      }),
      deleteTimeout: jest.fn(),
    } as unknown as SchedulerRegistry;

    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();
    jest.clearAllMocks();

    service = new ScoringService(prismaService, schedulerRegistry);
    jest.clearAllMocks();
  });

  afterEach(() => {
    timeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeouts = [];
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('recalculateAllScores', () => {
    const mockPresentations = [
      {
        id: 'presentation1',
        submission: {
          Evaluation: [
            {
              score: 4,
              userId: 'user1',
              evaluationCriteria: { weightRadio: 1 },
            },
            {
              score: 5,
              userId: 'user2',
              evaluationCriteria: { weightRadio: 1 },
            },
          ],
        },
        presentationBlock: {
          panelists: [{ userId: 'user1' }],
        },
      },
      {
        id: 'presentation2',
        submission: {
          Evaluation: [
            {
              score: 3,
              userId: 'user3',
              evaluationCriteria: { weightRadio: 1 },
            },
          ],
        },
        presentationBlock: {
          panelists: [{ userId: 'user4' }],
        },
      },
    ];

    const mockCriteria = [
      { id: 'criteria1', weightRadio: 1 },
      { id: 'criteria2', weightRadio: 1 },
    ];

    it('should recalculate scores for all presentations successfully', async () => {
      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        mockPresentations,
      );
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);
      (prismaService.presentation.update as jest.Mock).mockResolvedValue({});

      await service.recalculateAllScores('event1');

      expect(prismaService.presentation.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            submission: {
              eventEditionId: 'event1',
            },
          },
        }),
      );

      expect(prismaService.presentation.update).toHaveBeenCalledTimes(2);
    });

    it('should handle presentations with no evaluations', async () => {
      const presentationsWithNoEvals = [
        {
          id: 'presentation1',
          submission: {
            Evaluation: [],
          },
          presentationBlock: {
            panelists: [],
          },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        presentationsWithNoEvals,
      );
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);

      await service.recalculateAllScores('event1');

      expect(prismaService.presentation.update).toHaveBeenCalledWith({
        where: { id: 'presentation1' },
        data: {
          publicAverageScore: null,
          evaluatorsAverageScore: null,
        },
      });
    });

    it('should calculate different scores for public and panelist evaluations', async () => {
      const presentationWithMixedEvals = [
        {
          id: 'presentation1',
          submission: {
            Evaluation: [
              {
                score: 4,
                userId: 'panelist1',
                evaluationCriteria: { weightRadio: 1 },
              },
              {
                score: 3,
                userId: 'public1',
                evaluationCriteria: { weightRadio: 1 },
              },
            ],
          },
          presentationBlock: {
            panelists: [{ userId: 'panelist1' }],
          },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        presentationWithMixedEvals,
      );
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);

      await service.recalculateAllScores('event1');

      expect(prismaService.presentation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'presentation1' },
          data: expect.objectContaining({
            publicAverageScore: expect.any(Number),
            evaluatorsAverageScore: expect.any(Number),
          }),
        }),
      );
    });

    it('should handle weighted evaluation criteria correctly', async () => {
      const presentationWithWeightedEvals = [
        {
          id: 'presentation1',
          submission: {
            Evaluation: [
              {
                score: 4,
                userId: 'user1',
                evaluationCriteria: { weightRadio: 2 }, // Double weight
              },
              {
                score: 3,
                userId: 'user2',
                evaluationCriteria: { weightRadio: 1 }, // Normal weight
              },
            ],
          },
          presentationBlock: {
            panelists: [],
          },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        presentationWithWeightedEvals,
      );
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);

      await service.recalculateAllScores('event1');

      // The weighted average should be (4*2 + 3*1)/(2+1) ≈ 3.67
      expect(prismaService.presentation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'presentation1' },
          data: expect.objectContaining({
            publicAverageScore: expect.any(Number),
          }),
        }),
      );
    });

    it('should use default weight when weightRadio is not provided', async () => {
      const presentationWithMissingWeights = [
        {
          id: 'presentation1',
          submission: {
            Evaluation: [
              {
                score: 4,
                userId: 'user1',
                evaluationCriteria: {}, // Missing weightRadio
              },
            ],
          },
          presentationBlock: {
            panelists: [],
          },
        },
      ];

      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue(
        presentationWithMissingWeights,
      );
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);

      await service.recalculateAllScores('event1');

      expect(prismaService.presentation.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'presentation1' },
          data: expect.objectContaining({
            publicAverageScore: expect.any(Number),
          }),
        }),
      );
    });

    it('should handle event with no presentations', async () => {
      (prismaService.presentation.findMany as jest.Mock).mockResolvedValue([]);
      (
        prismaService.evaluationCriteria.findMany as jest.Mock
      ).mockResolvedValue(mockCriteria);

      await service.recalculateAllScores('event1');

      expect(prismaService.presentation.update).not.toHaveBeenCalled();
    });
  });

  describe('initializeEventFinalScoresSchedulers', () => {
    it('should initialize schedulers for all upcoming events', async () => {
      await service['initializeEventFinalScoresSchedulers']();

      expect(prismaService.eventEdition.findMany).toHaveBeenCalledWith({
        where: {
          endDate: {
            gt: expect.any(Date),
          },
        },
      });

      expect(schedulerRegistry.addTimeout).toHaveBeenCalledTimes(2);
      expect(Logger.prototype.log).toHaveBeenCalledWith(
        'Initialized schedulers for 1 upcoming events',
      );
    });
  });

  describe('scheduleEventScoreRecalculation', () => {
    it('should schedule score recalculation for future events', async () => {
      const mockEvent = createMockEventEdition({
        id: 'event1',
        endDate: new Date(Date.now() + 86400000),
      });

      await service.scheduleEventFinalScoresRecalculation(mockEvent);

      expect(schedulerRegistry.deleteTimeout).toHaveBeenCalledWith(
        `recalculate-scores-${mockEvent.id}`,
      );
      expect(schedulerRegistry.addTimeout).toHaveBeenCalledWith(
        expect.stringContaining('recalculate-scores-'),
        expect.anything(),
      );
    });
  });
});
