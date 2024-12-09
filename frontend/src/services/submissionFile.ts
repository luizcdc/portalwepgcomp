import { UUID } from 'crypto';

import { axiosInstance } from '@/utils/api';

const baseUrl = "/s3-utils";

export const submissionFileApi = {
    sendFile: async (file: File, idSubmission: UUID) => {
        const instance = axiosInstance();
        const formData = new FormData();

        formData.append("file", file);
        formData.append("idSubmission", idSubmission);

        const { data } = await instance.post(`${baseUrl}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    },

    getFiles: async () => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}/list`);

        return data;
    }
}