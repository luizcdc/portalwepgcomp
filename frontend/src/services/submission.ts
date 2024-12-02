import { SubmissionParams } from "@/models/submission";
import { axiosInstance } from "@/utils/api";

const baseUrl = "/submission";

export const submissionApi = {
    createSubmission: async (body: SubmissionParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    getSubmissions: async () => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`);

        return data;
    },

    getSubmissionById: async (idSubmission: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idSubmission}`);

        return data;
    },

    deleteSubmissionById: async (idSubmission: string) => {
        const instance = axiosInstance();

        const {data} = await instance.delete(`${baseUrl}/${idSubmission}`);

        return data;
    }
}