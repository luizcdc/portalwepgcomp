import { Injectable } from '@nestjs/common';
import { EvaluationStats } from './interfaces/evaluation-stats.interface';

@Injectable()
export class ScoringService {
  private readonly Z_SCORE = 1.96; // 95% confidence interval

  calculateWilsonScore(stats: EvaluationStats): number {
    const n = stats.numberOfRatings;
    if (n === 0) return 0;

    const p = stats.totalScore / (n * 5); // Convert to 0-1 scale
    const z = this.Z_SCORE;

    // Wilson Score calculation
    const numerator =
      p +
      (z * z) / (2 * n) -
      z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n);
    const denominator = 1 + (z * z) / n;

    return (numerator / denominator) * 5; // Convert back to 5-star scale
  }

  calculateBayesianAverage(stats: EvaluationStats): number {
    const PRIOR_RATINGS = 10; // Number of prior ratings to assume
    const PRIOR_MEAN = 3.0; // Prior mean rating (out of 5)

    return (
      (PRIOR_RATINGS * PRIOR_MEAN + stats.totalScore) /
      (PRIOR_RATINGS + stats.numberOfRatings)
    );
  }

  getConfidenceInterval(stats: EvaluationStats): {
    lower: number;
    upper: number;
  } {
    if (stats.numberOfRatings === 0) return { lower: 0, upper: 0 };

    const mean = stats.totalScore / stats.numberOfRatings;
    const stdDev = this.calculateStandardDeviation(stats);
    const stderr = stdDev / Math.sqrt(stats.numberOfRatings);

    return {
      lower: mean - this.Z_SCORE * stderr,
      upper: mean + this.Z_SCORE * stderr,
    };
  }

  private calculateStandardDeviation(stats: EvaluationStats): number {
    const mean = stats.totalScore / stats.numberOfRatings;
    const variance =
      Object.entries(stats.scores).reduce((acc, [score, count]) => {
        return acc + count * Math.pow(Number(score) - mean, 2);
      }, 0) / stats.numberOfRatings;

    return Math.sqrt(variance);
  }

  calculateAverageScore(evaluations: any[]): number | null {
    // get the average score of the all evaluations
    if (!evaluations.length) {
      return null;
    }

    const totalScore = evaluations.reduce(
      (sum, evaluation) => sum + evaluation.score,
      0,
    );
    return Number((totalScore / evaluations.length).toFixed(2));
  }
}
