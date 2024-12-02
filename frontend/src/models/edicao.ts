/* eslint-disable @typescript-eslint/no-unused-vars */

interface EdicaoParams {
  name?: string;
  description?: string;
  location?: string;
  coordinatorId?: string[];
  comissao?: string[];
  apoio?: string[];
  apoioAd?: string[];
  comunicacao?: string[];
  estudantes?: string[];
  presentationDuration?: string;
  salas?:string;
  sessoes?: string;
  callForPapersText?: string;
  endDate: string;
  submissionDeadline?: string;
  startDate?: string;

  

}

interface Edicao extends EdicaoParams {
  id: string;
  createdAt: string;
  deletedAt: string;
  updatedAt: string;
}
