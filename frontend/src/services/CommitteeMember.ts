"use client"
import axiosInstance from '@/utils/api';

const instance = axiosInstance;
const baseUrl = "/committee-member/";

export const committerMembersApi = {
    
    getAllMembers: async (): Promise<Committer[]> => {
        const { data } = await instance.get(`${baseUrl}`);

        return data;
    },

    getMemberById: async (idMember: string) => {
        const { data } = await instance.get(`${baseUrl}/${idMember}`);

        return data;
    }
}