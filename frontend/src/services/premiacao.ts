"use client"
import  axiosInstance  from '@/utils/api';

const baseUrlAwardedDoctoralStudents = "/awarded-doctoral-students";
const baseUrlAwardedPanelists = "/panelist-awards";

const instance = axiosInstance;

export const premiacaoApi = {
    listAwardedPanelistsById: async (idEdicao: string ) => {
        const { data } = await instance.get(`${baseUrlAwardedPanelists}/${idEdicao}`);

        return data;
    },

    listTopPanelistsById: async (idEdicao: string ) => {
        const { data } = await instance.get(`${baseUrlAwardedDoctoralStudents}/top-panelists/${idEdicao}`);

        return data;
    },

    listTopAudienceById: async (idEdicao: string ) => {
        const { data } = await instance.get(`${baseUrlAwardedDoctoralStudents}/top-audience/${idEdicao}`);

        return data;
    },
    createAwardedPanelists: async (body: AvaliadorParams ) => {
        const { data } = await instance.post(`${baseUrlAwardedDoctoralStudents}/bulk/`, body);

        return data;
    },
}