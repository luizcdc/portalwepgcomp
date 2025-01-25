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

  /**
   * Adjusts a date to Brazilian timezone (UTC-3).
   *
   * The dates stored in the database represent times in Brazil, but they are stored without an explicit timezone.
   * This causes the database to interpret the stored times as if they were in UTC (timezone 0). As a result,
   * comparisons between the current time in Brazil and the stored times may be inaccurate.
   *
   * For example:
   * - An event stored in the database with an `endDate` of "20:00" represents 8:00 PM in Brazil.
   * - However, because the database assumes the time is in UTC, it treats "20:00" as 8:00 PM UTC,
   *   which is equivalent to 5:00 PM in Brazil (UTC-3).
   * - When comparing the stored `endDate` with the current time in Brazil, the comparison will be off by 3 hours.
   *
   */
  private adjustToBrazilianTimezone(date: Date): Date {
    const localDate = new Date(date);
    return new Date(localDate.getTime() + this.TIMEZONE_OFFSET);
  }

  private adjustToUTC(date: Date): Date {
    const timezoneOffset = date.getTimezoneOffset();
    return new Date(date.getTime() + timezoneOffset * 60000);
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

    const now = new Date();
    const endDate = event.endDate;

    // Find the last presentation block
    const lastBlock = await this.prismaClient.presentationBlock.findFirst({
      where: {
        eventEditionId: event.id,
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    let scheduleTime: Date;
    let decision: string;

    // If the last block is General type, use its start time
    if (lastBlock && lastBlock.type === 'General') {
      scheduleTime = lastBlock.startTime;
      decision = 'Last block start time';
    } else {
      // Otherwise, use the original event end date
      scheduleTime = endDate;
      decision = 'Event end date';
    }

    const delay = scheduleTime.getTime() - now.getTime();

    // Only schedule if the calculated time hasn't passed yet
    if (delay > 0) {
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
          `Scheduled final score recalculation for event ${event.id} at ${scheduleTime} (${decision})`,
        );
      }
    }
  }

  async handleEventUpdate(eventEditionId: string): Promise<void> {
    const eventEdition = await this.prismaClient.eventEdition.findUnique({
      where: {
        id: eventEditionId,
      },
    });

    if (!eventEdition) {
      throw new Error(`Event ${eventEditionId} not found`);
    }

    this.scheduleEventFinalScoresRecalculation(eventEdition);
  }
}
