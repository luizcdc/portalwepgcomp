import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// TODO: BASIC VALUES IF THE EVENT HAS FEW EVALUATIONS
// TODO: KEEP FIXED THE PRIOR WEIGHT AND THE CONFIDENCE FACTOR OR MAKE THEM BASED ON THE EVENT STATS?

interface EventStats {
  totalPresentations: number;
  totalEvaluations: number;
  scoreDistribution: { [key: number]: number };
  meanScore: number;
  standardDeviation: number;
}

@Injectable()
export class ScoringService {
  // Confidence factor for prior weight
  private readonly PRIOR_WEIGHT = 3;

  constructor(private prisma: PrismaService) {}

  private async calculateEventStats(
    eventEditionId: string,
  ): Promise<EventStats> {
    const presentations = await this.prisma.presentation.findMany({
      where: {
        submission: {
          eventEditionId,
        },
      },
      include: {
        submission: {
          include: {
            Evaluation: {
              include: {
                evaluationCriteria: true,
              },
            },
          },
        },
      },
    });

    let totalScore = 0;
    let totalEvaluations = 0;
    const scores: number[] = [];
    const scoreDistribution: { [key: number]: number } = {};

    for (const presentation of presentations) {
      for (const evaluation of presentation.submission.Evaluation) {
        const weightedScore =
          evaluation.score * (evaluation.evaluationCriteria.weightRadio || 1);
        const weight = evaluation.evaluationCriteria.weightRadio || 1;

        const normalizedScore = weightedScore / weight;
        scores.push(normalizedScore);

        const roundedScore = Math.round(normalizedScore * 2) / 2;
        scoreDistribution[roundedScore] =
          (scoreDistribution[roundedScore] || 0) + 1;
        totalScore += normalizedScore;
        totalEvaluations++;
      }
    }

    if (totalEvaluations === 0) {
      return {
        totalPresentations: presentations.length,
        totalEvaluations: 0,
        scoreDistribution: {},
        meanScore: 0,
        standardDeviation: 0,
      };
    }

    const meanScore = totalScore / totalEvaluations;
    const standardDeviation = Math.sqrt(
      scores.reduce((sum, score) => sum + Math.pow(score - meanScore, 2), 0) /
        totalEvaluations,
    );

    return {
      totalPresentations: presentations.length,
      totalEvaluations,
      scoreDistribution,
      meanScore,
      standardDeviation,
    };
  }

  // Calculate Bayesian average using event statistics as prior
  private calculateBayesianMean(
    evaluations: { score: number; weightRadio: number }[],
    eventStats: EventStats,
    //isPanelist: boolean,
  ): number | null {
    if (evaluations.length === 0) {
      return null;
    }

    // Calculate weighted sample mean
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const e of evaluations) {
      const weight = e.weightRadio || 1;
      totalWeightedScore += e.score * weight;
      totalWeight += weight;
    }

    const sampleMean = totalWeightedScore / totalWeight;

    // Use event mean as prior
    const priorMean = eventStats.meanScore;

    // Adjust prior weight based on whether it's a panelist score
    const priorWeight = this.PRIOR_WEIGHT;

    // Calculate Bayesian mean
    // (prior_weight * prior_mean + total_weight * sample_mean) / (prior_weight + total_weight)
    const bayesianMean =
      (priorWeight * priorMean + totalWeight * sampleMean) /
      (priorWeight + totalWeight);

    return Math.max(0, Math.min(5, bayesianMean));
  }

  async updatePresentationScores(presentationId: string): Promise<void> {
    const presentation = await this.prisma.presentation.findUnique({
      where: { id: presentationId },
      include: {
        submission: {
          include: {
            eventEdition: true,
            Evaluation: {
              include: {
                evaluationCriteria: true,
                user: true,
              },
            },
          },
        },
        presentationBlock: {
          include: {
            panelists: true,
          },
        },
      },
    });

    if (!presentation) return;

    const eventStats = await this.calculateEventStats(
      presentation.submission.eventEdition.id,
    );

    const panelistIds = presentation.presentationBlock.panelists.map(
      (p) => p.userId,
    );

    const publicEvaluations: { score: number; weightRadio: number }[] = [];
    const panelistEvaluations: { score: number; weightRadio: number }[] = [];

    for (const evaluation of presentation.submission.Evaluation) {
      const evaluationData = {
        score: evaluation.score,
        weightRadio: evaluation.evaluationCriteria.weightRadio || 1,
      };

      if (evaluation.userId && panelistIds.includes(evaluation.userId)) {
        panelistEvaluations.push(evaluationData);
      } else {
        publicEvaluations.push(evaluationData);
      }
    }

    const publicScore = this.calculateBayesianMean(
      publicEvaluations,
      eventStats,
      //false,
    );
    const evaluatorsScore = this.calculateBayesianMean(
      panelistEvaluations,
      eventStats,
      //true,
    );

    await this.prisma.presentation.update({
      where: { id: presentationId },
      data: {
        publicAverageScore: publicScore,
        evaluatorsAverageScore: evaluatorsScore,
      },
    });
  }

  async recalculateAllScores(eventEditionId: string): Promise<void> {
    const eventStats = await this.calculateEventStats(eventEditionId);

    const presentations = await this.prisma.presentation.findMany({
      where: {
        submission: {
          eventEditionId,
        },
      },
      include: {
        submission: {
          include: {
            Evaluation: {
              include: {
                evaluationCriteria: true,
                user: true,
              },
            },
          },
        },
        presentationBlock: {
          include: {
            panelists: true,
          },
        },
      },
    });

    for (const presentation of presentations) {
      const panelistIds = presentation.presentationBlock.panelists.map(
        (p) => p.userId,
      );

      const publicEvaluations: { score: number; weightRadio: number }[] = [];
      const panelistEvaluations: { score: number; weightRadio: number }[] = [];

      for (const evaluation of presentation.submission.Evaluation) {
        const evaluationData = {
          score: evaluation.score,
          weightRadio: evaluation.evaluationCriteria.weightRadio || 1,
        };

        if (evaluation.userId && panelistIds.includes(evaluation.userId)) {
          panelistEvaluations.push(evaluationData);
        } else {
          publicEvaluations.push(evaluationData);
        }
      }

      const publicScore = this.calculateBayesianMean(
        publicEvaluations,
        eventStats,
        //false,
      );
      const evaluatorsScore = this.calculateBayesianMean(
        panelistEvaluations,
        eventStats,
        //true,
      );

      await this.prisma.presentation.update({
        where: { id: presentation.id },
        data: {
          publicAverageScore: publicScore,
          evaluatorsAverageScore: evaluatorsScore,
        },
      });
    }
  }
}
