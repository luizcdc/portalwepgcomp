/* eslint-disable @typescript-eslint/no-unused-vars */
interface EvaluationParams{
    userId?: string;
    submissionId: string;
    evaluationCriteriaId: string;
    score: number;
    comments?: string;
}

interface Evaluation extends EvaluationParams{
    id?: string;
    email?: string;
    name?: string;
}

interface EvaluationCriteria{
    id: string;
    eventEditionId: string;
    title: string;
    description: string;
    weightRadio: number | null;
    createdAt: Date;
    updatedAt: Date;
}