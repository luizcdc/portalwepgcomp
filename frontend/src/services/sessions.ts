"use client"
import axiosInstance from '@/utils/api';

const baseUrl = "/presentation-block";

const instance = axiosInstance;

export const sessionApi = {
    listSessions: async (idEdition: string) => {
        const { data } = await instance.get(`${baseUrl}/event-edition/${idEdition}`);

        return data;
    },

    getSessionById: async (idSession: string) => {
        const { data } = await instance.get(`${baseUrl}/${idSession}`);

        return data;
    },

    createSession: async (body: SessaoParams) => {
        const { data } = await instance.post(`${baseUrl}`, body);

        return data;
    },

    updateSessionById: async (idSession: string, body: SessaoParams) => {
        const { data } = await instance.patch(`${baseUrl}/${idSession}`, body);

        return data;
    },

    deleteSessionById: async (idSession: string) => {
        const { data } = await instance.delete(`${baseUrl}/${idSession}`);

        return data;
    },

    swapPresentationsOnSession: async ( idSession: string,
        body: SwapPresentationsOnSession) => {
        const { data } = await instance.patch(`${baseUrl}/${idSession}/presentations/swap`, body);

        return data;
    },
}