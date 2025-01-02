/* eslint-disable @typescript-eslint/no-unused-vars */

type PremiacaoCategoriaProps = {
    categoria: string;
    premiacoes: Premiacoes[];
    avaliadores: AuthorOrEvaluator[];
};

interface AuthorOrEvaluator {
    id: string;
    name: string;
    email: string;
    registrationNumber: string;
    photoFilePath: string;
    profile: Record<string, unknown>;
    level: Record<string, unknown>;
    isActive?: boolean;
}
  
interface Submission {
    id: string;
    title: string;
    abstract: string;
    pdfFile: string;
    phoneNumber: string;
    coAdvisor: string;
    status: Record<string, unknown>;
    mainAuthor: AuthorOrEvaluator;
}
  
interface Premiacoes {
    id: string;
    presentationBlockId: string;
    positionWithinBlock: number;
    status: Record<string, unknown>;
    publicAverageScore: number;
    evaluatorsAverageScore: number;
    submission: Submission;
}
  