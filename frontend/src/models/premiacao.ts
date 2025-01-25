/* eslint-disable @typescript-eslint/no-unused-vars */

type PremiacaoCategoriaProps = {
    categoria: string;
    searchValue: string;
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

interface AvaliadorParams {   
  eventEditionId: string,
  panelists: string[]

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
