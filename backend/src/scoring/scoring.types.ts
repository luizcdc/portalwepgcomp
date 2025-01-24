export interface ScoringConfig {
  /* 
    Actualy a non intutive term, increase the confidence value 
    to decrease the impact of lower number of evaluations
  */
  defaultPublicConfidence: number;
  defaultPanelistConfidence: number;
  // ( number of evaluations) / (number of criteria)
  minEvaluationsForReliableStats: number;
  // Default score for the moment when there are no event stats
  defaultNeutralScore: number;
  minScore: number;
  maxScore: number;
  // Percentile to calculate confidence numbers
  percentileForConfidence: number;
  // Default weight for evaluation criteria
  defaultWeight: number;
}

export interface EventStats {
  totalPresentations: number;
  totalEvaluations: number;
  meanScore: number;
  publicConfidenceNumber: number;
  panelistConfidenceNumber: number;
  publicMeanScore: number;
  panelistMeanScore: number;
}
