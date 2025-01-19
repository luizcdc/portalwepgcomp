"use client"
import axiosInstance from '@/utils/api';

const baseUrl = "/users";
const authBaseUrl = "/auth";
const instance = axiosInstance;

export const userApi = {
    getUsers: async (params: GetUserParams) => {

        const { data } = await instance.get(`${baseUrl}`, { params });

        return data;
    },

    getAdvisors: async () => {

        const { data } = await instance.get(`${baseUrl}/advisors`);

        return data;
    },

    switchActiveUser: async (userId: string) => {

        const { data } = await instance.patch(`${baseUrl}/activate/${userId}`);

        return data;
    },

    markAsDefaultUser: async (body: SetPermissionParams) => {
        const { data } = await instance.post(`${baseUrl}/set-default`, body);

        return data;
    },

    markAsAdminUser: async (body: SetPermissionParams) => {
        const { data } = await instance.post(`${baseUrl}/set-admin`, body);

        return data;
    },

    markAsSpAdminUser: async (body: SetPermissionParams) => {
        const { data } = await instance.post(`${baseUrl}/set-super-admin`, body);

        return data;
    },

    registerUser: async (body: RegisterUserParams) => {

        const { data } = await instance.post(`${baseUrl}/register`, body);

        return data;
    },

    resetPasswordSendEmail: async (body: ResetPasswordSendEmailParams) => {

        const { data } = await instance.post(`${authBaseUrl}/forgot-password`, body);

        return data;
    },

    resetPassword: async (body: ResetPasswordParams) => {

        const { data } = await instance.post(`${authBaseUrl}/reset-password?token=${body.token}`, { newPassword: body.newPassword });

        return data;
    },
}
