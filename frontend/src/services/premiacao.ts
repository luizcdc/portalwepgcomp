"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/awarded-doctoral-students";

export const premiacaoApi = {
    listAvaliadoresById: async (idEdicao: string ) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/top-panelists/${idEdicao}`);

        return data;
    },
}