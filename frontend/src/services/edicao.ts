"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/event";
const instance = axiosInstance();

export const edicaoApi = {
    listEdicao: async () => {
        

        const { data } = await instance.get(`${baseUrl}`);

        return data;
    },

    getEdicaoById: async (idEdicao: string) => {

        const { data } = await instance.get(`${baseUrl}/${idEdicao}`);

        return data;
    },

    createEdicao: async (body: EdicaoParams) => {

        const { data } = await instance.post(`${baseUrl}/create-from-event-edition-form`, body);

        return data;
    },

    updateEdicaoById: async (idEdicao: string, body: EdicaoParams) => {

        const { data } = await instance.put(`${baseUrl}/${idEdicao}`, body);

        return data;
    },

   updateEdicaoActivate: async (idEdicao: string, body: EdicaoParams) => {

        const { data } = await instance.patch(`${baseUrl}/activate/${idEdicao}`, body);

        return data;
    },
    deleteEdicaoById: async (idEdicao: string) => {

        const { data } = await instance.delete(`${baseUrl}/${idEdicao}`);

        return data;
    },
}