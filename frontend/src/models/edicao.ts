/* eslint-disable @typescript-eslint/no-unused-vars */

interface EdicaoParams {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  coordinatorId?: string;
  organizingCommitteeIds?: string[];
  itSupportIds?: string[];
  administrativeSupportIds?: string[];
  communicationIds?: string[];
  presentationsPerPresentationBlock?: number;
  presentationDuration?: number;
  callForPapersText?: string;
  submissionDeadline?: string;
  partnersText?:string

}


interface Edicao extends EdicaoParams {
  id: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}
