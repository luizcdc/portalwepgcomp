export interface EvaluationStats {
  totalScore: number;
  numberOfRatings: number;
  scores: { [key: number]: number }; // Distribution of scores (1-5 stars)
}
