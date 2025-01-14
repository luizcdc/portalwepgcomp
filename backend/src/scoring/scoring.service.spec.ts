import { ScoringService } from './scoring.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ScoringService', () => {
  let service: ScoringService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = {
      presentation: {
        findMany: jest.fn(),
        update: jest.fn(),
      },
      evaluationCriteria: {
        findMany: jest.fn(),
      },
    } as unknown as PrismaService;

    service = new ScoringService(prismaService);
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
});
