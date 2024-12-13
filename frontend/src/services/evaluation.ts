"use client"
import { axiosInstance } from "@/utils/api"

const baseUrl = "/evaluations";
const instance = axiosInstance();

export const evaluationApi = {
    createEvaluation: async (body: EvaluationParams[]) => {
        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    getEvaluation: async (submissionId: string) => {
        const { data } = await instance.get(`${baseUrl}/submission/${submissionId}/final-grade`);

        return data;
    }
}