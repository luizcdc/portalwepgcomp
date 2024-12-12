import { UUID } from 'crypto';

import { GetSubmissionParams, SubmissionParams } from '@/models/submission';
import { axiosInstance } from '@/utils/api';

const baseUrl = "/submission";
const instance = axiosInstance();

export const submissionApi = {
    getSubmissions: async (params: GetSubmissionParams) => {
        const { data } = await instance.get(`${baseUrl}`, { params });

        return data;
    },

    getSubmissionById: async (idSubmission: UUID) => {

        const { data } = await instance.get(`${baseUrl}/${idSubmission}`);

        return data;
    },

    createSubmission: async (body: SubmissionParams) => {

        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    updateSubmissionById: async (idSubmission: UUID, body: SubmissionParams) => {

        const { data } = await instance.put(`${baseUrl}/${idSubmission}`, body);

        return data;
    },

    deleteSubmissionById: async (idSubmission: UUID) => {

        const { data } = await instance.delete(`${baseUrl}/${idSubmission}`);

        return data;
    },
}
