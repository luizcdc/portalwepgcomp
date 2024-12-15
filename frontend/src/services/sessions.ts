"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/presentation-block";

export const sessionApi = {
    listSessions: async (idEdition: string) => {
        const instance = axiosInstance();
        console.log("idEvento: ", idEdition)
        const { data } = await instance.get(`${baseUrl}/event-edition/${idEdition}`);
        console.log("Data: ", data)
        return data;
    },

    getSessionById: async (idSession: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idSession}`);

        return data;
    },

    createSession: async (body: SessaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    updateSessionById: async (idSession: string, body: SessaoParams) => {
        const instance = axiosInstance();

        const { data } = await instance.patch(`${baseUrl}/${idSession}`, body);

        return data;
    },

    deleteSessionById: async (idSession: string) => {
        const instance = axiosInstance();

        const { data } = await instance.delete(`${baseUrl}/${idSession}`);

        return data;
    },
}