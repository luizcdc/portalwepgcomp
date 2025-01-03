"use client"
import axiosInstance from "@/utils/api"

const baseUrl = "/evaluations";
const instance = axiosInstance;

export const evaluationApi = {
    makeEvaluation: async (body: EvaluationParams[]) => {
        const { data } = await instance.put(`${baseUrl}`, body);

        return data;
    },

    getEvaluationByUser: async (userId: string) => {
        const { data } = await instance.get(`${baseUrl}/user`);

        return data;
    },

    getEvaluation: async (submissionId: string) => {
        const { data } = await instance.get(`${baseUrl}/submission/${submissionId}/final-grade`);

        return data;
    },

    getEvaluationCriteria: async (eventEditionId: string) => {
        const { data } = await instance.get(`/evaluation-criteria/${eventEditionId}`)

        return data;
    }
}