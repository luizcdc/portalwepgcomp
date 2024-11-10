"use client"
import { axiosInstance } from '@/utils/api';

const baseUrl = "/users";

export const userApi = {
    registerUser: async (body: RegisterUserParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}/register`, body);

        return data;
    }
}