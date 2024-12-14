import { axiosInstance } from "@/utils/api";

export interface Presentation {
    id: string;
    presentationBlockId: string;
    positionWithinBlock: number;
    presentationTime: string;
    submission: Submission;
}

export interface Submission {
    id: string;
    advisorId: string;
    mainAuthorId: string;
    eventEditionId: string;
    title: string;
    mainAuthor: UserAccount;
    type: string;
    abstract: string;
    pdfFile: string;
    phoneNumber: string;
    proposedPresentationBlockId: any;
    proposedPositionWithinBlock: any;
    coAdvisor: any;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface UserAccount {
    id: string
    name: string
    email: string
    registrationNumber: string
    photoFilePath: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}

const baseUrl = "/presentation";
const instance = axiosInstance();
  
export const presentationApi = {
    getPresentations: async (eventEditionId: string): Promise<Presentation[]> => {
        const { data } = await instance.get(`${baseUrl}`, {
            params: { eventEditionId },
            headers: {
                "Content-Type": "application/json",
            },
        });

        return data;
    }
}