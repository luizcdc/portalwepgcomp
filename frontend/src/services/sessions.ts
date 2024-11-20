"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/session";

export const sessionApi = {
    listSessions: async () => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`);

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

        const { data } = await instance.put(`${baseUrl}/${idSession}`, body);

        return data;
    },

    deleteSessionById: async (idSession: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idSession}`);

        return data;
    },
}