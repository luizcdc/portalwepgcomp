"use client"
import { axiosInstance } from '@/utils/api';

const baseUrlAwardedDoctoralStudents = "/awarded-doctoral-students";
const baseUrlAwardedPanelists = "/panelist-awards";

export const premiacaoApi = {
    listAwardedPanelistsById: async (idEdicao: string ) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrlAwardedPanelists}/${idEdicao}/panelists`);

        return data;
    },

    listTopPanelistsById: async (idEdicao: string ) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrlAwardedDoctoralStudents}/top-panelists/${idEdicao}`);

        return data;
    },

    listTopAudienceById: async (idEdicao: string ) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrlAwardedDoctoralStudents}/top-panelists/${idEdicao}`);

        return data;
    },
}