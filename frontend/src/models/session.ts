/* eslint-disable @typescript-eslint/no-unused-vars */

type SessaoTipo = "General" | "Presentation";
interface SessaoParams {
  type: SessaoTipo;
  eventEditionId: string;
  roomId: string;
  startTime: string;
  title?: string;
  numPresentations?: number;
  speakerName?: string;
  duration?: number;
  apresentacoes?: string[];
  avaliadores?: string[];
}

interface AvailablePositionsWithInBlock {
  positionWithinBlock: number;
  startTime: string;
}

interface Panelist {
  createdAt: string;
  id: string;
  presentationBlockId: string;
  status: string;
  updatedAt: string;
  user: User | null;
  userId: string;
}

interface Presentation {
  id: string;
  submissionId: symbol;
  presentationBlockId: string;
  positionWithinBlock: number;
  status: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  submission: Submission | null;
}

interface Sessao extends SessaoParams {
  id: string;
  availablePositionsWithInBlock: AvailablePositionsWithInBlock[];
  panelists: Panelist[];
  presentations: Presentation[];
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}

interface SwapPresentationsOnSession {
  presentation1Id: string;
  presentation2Id: string;
}
