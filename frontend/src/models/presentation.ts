/* eslint-disable @typescript-eslint/no-unused-vars */
interface Presentation {
  id: string;
  presentationBlockId: string;
  positionWithinBlock: number;
  presentationTime?: string;
  submission: Submission | null;
  submissionId: symbol;
  status: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
}

interface PresentationBookmark {
  bookmarked: boolean;
}

interface PresentationBookmarkRegister {
  presentationId: string;
}

interface UserAccount {
  id: string
  name: string
  email: string
  registrationNumber: string
  photoFilePath: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}