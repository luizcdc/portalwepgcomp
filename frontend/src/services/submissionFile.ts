import { axiosInstance } from '@/utils/api';

const baseUrl = "/s3-utils";
const instance = axiosInstance();

export const submissionFileApi = {
    sendFile: async (file: File, idUser: string) => {
        
        const formData = new FormData();
        formData.append("file", file);
        formData.append("idSubmission", idUser);

        const { data } = await instance.post(`${baseUrl}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    },

    getFiles: async () => {
        const { data } = await instance.post(`${baseUrl}/list`);

        return data;
    }
}
