"use client"
import { axiosInstance } from '@/utils/api';


const baseUrl = "/committee-member/";

export const committerMembersApi = {
    
    getAllMembers: async (): Promise<Committer[]> => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`);
        console.log("Return commiter: ", data)
        return data;
    },

    getMemberById: async (idMember: string) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/${idMember}`);

        return data;
    }
}