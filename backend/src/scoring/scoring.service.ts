import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EventStats, ScoringConfig } from './scoring.types';
import { EventEdition } from '@prisma/client';

@Injectable()
export class ScoringService {
  private readonly MAX_TIMEOUT = 2147483647; // ~24.85 days in milliseconds
  // DB is stored in UTC, but when we get it from the DB, it's already in UTC-3
  private readonly TIMEZONE_OFFSET = -3 * 60 * 60 * 1000; // UTC-3 in milliseconds

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
  private readonly logger = new Logger(ScoringService.name);

  constructor(
    private prismaClient: PrismaService,
    private schedulerRegistry: SchedulerRegistry,
  ) {
    this.initializeEventFinalScoresSchedulers();
  }

  private async calculateEventStats(
    eventEditionId: string,
  ): Promise<EventStats> {
    const presentations = await this.prismaClient.presentation.findMany({
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
    const criteria = await this.prismaClient.evaluationCriteria.findMany({
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

    const presentations = await this.prismaClient.presentation.findMany({
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

      await this.prismaClient.presentation.update({
        where: { id: presentation.id },
        data: {
          publicAverageScore: publicScore,
          evaluatorsAverageScore: evaluatorsScore,
        },
      });
    }
  }

  private adjustToBrazilianTimezone(date: Date): Date {
    const localDate = new Date(date);
    return new Date(localDate.getTime() + this.TIMEZONE_OFFSET);
  }

  private async initializeEventFinalScoresSchedulers() {
    try {
      const events = await this.prismaClient.eventEdition.findMany({
        where: {
          endDate: {
            gt: this.adjustToBrazilianTimezone(new Date()),
          },
        },
      });

      events.forEach((event) => {
        this.scheduleEventFinalScoresRecalculation(event);
      });

      this.logger.log(
        `Initialized schedulers for ${events.length} upcoming events`,
      );
    } catch (error) {
      this.logger.error('Failed to initialize event schedulers:', error);
    }
  }

  async scheduleEventFinalScoresRecalculation(event: EventEdition) {
    const jobName = `recalculate-scores-${event.id}`;
    try {
      this.schedulerRegistry.deleteTimeout(jobName);
    } catch {
      this.logger.log(`No existing timeout found for event ${event.id}`);
    }

    const now = this.adjustToBrazilianTimezone(new Date());
    const endDate = new Date(event.endDate);
    const delay = endDate.getTime() - now.getTime();
    // Only schedule if the event hasn't ended yet
    if (delay > 0) {
      /* 
        If delay exceeds maximum timeout, schedule an intermediate 
        timeout (32-bit signed integer limit for ms representation)
      */
      if (delay > this.MAX_TIMEOUT) {
        const timeout = setTimeout(() => {
          this.logger.log(
            `Intermediate timeout reached for event ${event.id}, rescheduling...`,
          );
          this.scheduleEventFinalScoresRecalculation(event);
        }, this.MAX_TIMEOUT);

        this.schedulerRegistry.addTimeout(jobName, timeout);
        this.logger.log(
          `Scheduled intermediate timeout for event ${event.id} in ${Math.floor(
            this.MAX_TIMEOUT / (1000 * 60 * 60 * 24),
          )} days`,
        );
      } else {
        const timeout = setTimeout(async () => {
          try {
            this.logger.log(
              `Recalculating scores for event ${event.id} (${event.name})`,
            );
            await this.recalculateAllScores(event.id);
            this.logger.log(
              `Successfully recalculated scores for event ${event.id}`,
            );
          } catch (error) {
            this.logger.error(
              `Failed to recalculate scores for event ${event.id}:`,
              error,
            );
          }
        }, delay);

        this.schedulerRegistry.addTimeout(jobName, timeout);
        this.logger.log(
          `Scheduled final score recalculation for event ${event.id} at ${endDate}`,
        );
      }
    }
  }

  async handleEventUpdate(event: EventEdition) {
    this.scheduleEventFinalScoresRecalculation(event);
  }
}
