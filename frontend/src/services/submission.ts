import { UUID } from 'crypto';

import { GetSubmissionParams, SubmissionParams } from '@/models/submission';
import { axiosInstance } from '@/utils/api';

const baseUrl = "/submission";

export const submissionApi = {
    getSubmissions: async (params: GetSubmissionParams) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`, { params });

        return data;
    },

    getSubmissionById: async (idSubmission: UUID) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idSubmission}`);

        return data;
    },

    createSubmission: async (body: SubmissionParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    updateSubmissionById: async (idSubmission: UUID, body: SubmissionParams) => {
        const instance = axiosInstance();

        const { data } = await instance.put(`${baseUrl}/${idSubmission}`, body);

        return data;
    },

    deleteSubmissionById: async (idSubmission: UUID) => {
        const instance = axiosInstance();

        const { data } = await instance.delete(`${baseUrl}/${idSubmission}`);

        return data;
    },
}