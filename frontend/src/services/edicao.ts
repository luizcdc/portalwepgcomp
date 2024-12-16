"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/event";

export const edicaoApi = {
    listEdicao: async () => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`);

        return data;
    },

    getEdicaoById: async (idEdicao: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idEdicao}`);

        return data;
    },

    getEdicaoByYear: async (year: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/year/${year}`);

        return data;
    },

    createEdicao: async (body: EdicaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    updateEdicaoById: async (idEdicao: string, body: EdicaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.put(`${baseUrl}/${idEdicao}`, body);

        return data;
    },

   updateEdicaoActivate: async (idEdicao: string, body: EdicaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.patch(`${baseUrl}/activate/${idEdicao}`, body);

        return data;
    },

    deleteEdicaoById: async (idEdicao: string) => {
        const instance = axiosInstance();

        const { data } = await instance.delete(`${baseUrl}/${idEdicao}`);

        return data;
    },
}