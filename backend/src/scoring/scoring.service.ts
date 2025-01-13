import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStats, ScoringConfig } from './scoring.types';

@Injectable()
export class ScoringService {
  private config: ScoringConfig = {
    defaultPublicConfidence: 5,
    defaultPanelistConfidence: 3,
    minEvaluationsForReliableStats: 5,
    defaultNeutralScore: 3.0,
    minScore: 0,
    maxScore: 5,
    percentileForConfidence: 0.4,
    defaultWeight: 1,
  };

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

    const publicEvaluationCounts: number[] = [];
    const panelistEvaluationCounts: number[] = [];
    let totalPublicScore = 0;
    let totalPanelistScore = 0;
    let totalPublicEvaluations = 0;
    let totalPanelistEvaluations = 0;

    for (const presentation of presentations) {
      const panelistIds = presentation.presentationBlock.panelists.map(
        (p) => p.userId,
      );

      let publicCount = 0;
      let panelistCount = 0;
      let publicScoreSum = 0;
      let panelistScoreSum = 0;

      for (const evaluation of presentation.submission.Evaluation) {
        const weightedScore =
          evaluation.score *
          (evaluation.evaluationCriteria.weightRadio ||
            this.config.defaultWeight);

        const weight =
          evaluation.evaluationCriteria.weightRadio ||
          this.config.defaultWeight;

        const normalizedScore = weightedScore / weight;
        if (evaluation.userId && panelistIds.includes(evaluation.userId)) {
          panelistCount++;
          panelistScoreSum += normalizedScore;
        } else {
          publicCount++;
          publicScoreSum += normalizedScore;
        }
      }

      if (publicCount > 0) {
        publicEvaluationCounts.push(publicCount);
        totalPublicScore += publicScoreSum;
        totalPublicEvaluations += publicCount;
      }
      if (panelistCount > 0) {
        panelistEvaluationCounts.push(panelistCount);
        totalPanelistScore += panelistScoreSum;
        totalPanelistEvaluations += panelistCount;
      }
    }

    // Sort arrays to calculate confidence numbers
    const sortedPublicCounts = publicEvaluationCounts.sort((a, b) => a - b);
    const sortedPanelistCounts = panelistEvaluationCounts.sort((a, b) => a - b);

    // Calculate separate confidence numbers
    const publicConfidenceNumber =
      sortedPublicCounts[
        Math.floor(
          sortedPublicCounts.length * this.config.percentileForConfidence,
        )
      ] || this.config.defaultPublicConfidence;

    const panelistConfidenceNumber =
      sortedPanelistCounts[
        Math.floor(
          sortedPanelistCounts.length * this.config.percentileForConfidence,
        )
      ] || this.config.defaultPanelistConfidence;

    // Calculate separate mean scores
    const publicMeanScore = this.isRealiableStats(
      eventEditionId,
      totalPublicEvaluations,
    )
      ? totalPublicScore / totalPublicEvaluations
      : this.config.defaultNeutralScore;

    const panelistMeanScore = this.isRealiableStats(
      eventEditionId,
      totalPanelistEvaluations,
    )
      ? totalPanelistScore / totalPanelistEvaluations
      : this.config.defaultNeutralScore;

    // Calculate overall mean score
    const totalEvaluations = totalPublicEvaluations + totalPanelistEvaluations;
    const meanScore = this.isRealiableStats(eventEditionId, totalEvaluations)
      ? (totalPublicScore + totalPanelistScore) / totalEvaluations
      : this.config.defaultNeutralScore;

    return {
      totalPresentations: presentations.length,
      totalEvaluations,
      meanScore,
      publicConfidenceNumber,
      panelistConfidenceNumber,
      publicMeanScore,
      panelistMeanScore,
    };
  }

  private async isRealiableStats(
    eventEditionId: string,
    actualNumOfEvaluations: number,
  ): Promise<boolean> {
    const criteria = await this.prisma.evaluationCriteria.findMany({
      where: {
        eventEditionId,
      },
    });

    return (
      criteria.length * this.config.minEvaluationsForReliableStats <=
      actualNumOfEvaluations
    );
  }

  private calculateBayesianMean(
    evaluations: { score: number; weightRadio: number }[],
    eventStats: EventStats,
    isPanelist: boolean,
  ): number | null {
    if (evaluations.length === 0) {
      return null;
    }

    // Calculate weighted sample mean
    let totalWeightedScore = 0;
    let totalWeight = 0;

    for (const e of evaluations) {
      const weight = e.weightRadio || this.config.defaultWeight;
      totalWeightedScore += e.score * weight;
      totalWeight += weight;
    }

    const sampleMean = totalWeightedScore / totalWeight;

    // Use different confidence numbers and mean scores based on evaluator type
    const confidenceNumber = isPanelist
      ? eventStats.panelistConfidenceNumber
      : eventStats.publicConfidenceNumber;

    const priorMean = isPanelist
      ? eventStats.panelistMeanScore
      : eventStats.publicMeanScore;

    const numEvaluations = evaluations.length;
    const bayesianMean =
      (numEvaluations * sampleMean + confidenceNumber * priorMean) /
      (numEvaluations + confidenceNumber);

    return Math.max(
      this.config.minScore,
      Math.min(this.config.maxScore, bayesianMean),
    );
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
          weightRadio:
            evaluation.evaluationCriteria.weightRadio ||
            this.config.defaultWeight,
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
        false,
      );
      const evaluatorsScore = this.calculateBayesianMean(
        panelistEvaluations,
        eventStats,
        true,
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
