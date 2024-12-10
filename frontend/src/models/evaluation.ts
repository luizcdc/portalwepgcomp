interface EvaluationParams{
    userId: string;
    submissionId: string;
    evaluationCriteriaId: string;
    score: number;
}

interface Evaluation extends EvaluationParams{
    id: string;
}