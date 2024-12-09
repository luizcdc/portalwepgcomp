"use client"
import { GetUserParams, RegisterUserParams, ResetPasswordParams, ResetPasswordSendEmailParams } from '@/models/user';
import { axiosInstance } from '@/utils/api';

const baseUrl = "/users";
const authBaseUrl = "/auth";

export const userApi = {
    getUsers: async (params: GetUserParams) => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}`, { params });

        return data;
    },

    getAdvisors: async () => {
        const instance = axiosInstance();

        const { data } = await instance.get(`${baseUrl}/advisors`);

        return data;
    },

    registerUser: async (body: RegisterUserParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}/register`, body);

        return data;
    },

    resetPasswordSendEmail: async (body: ResetPasswordSendEmailParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${authBaseUrl}/forgot-password`, body);

        return data;
    },

    resetPassword: async (body: ResetPasswordParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${authBaseUrl}/reset-password?token=${body.token}`, { newPassword: body.newPassword });

        return data;
    },
}