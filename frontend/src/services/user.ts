"use client"

import { GetUsers, RegisterUserParams, ResetPasswordParams, ResetPasswordSendEmailParams } from '@/models/user';
import { axiosInstance } from '@/utils/api';

const baseUrl = "/users";
const authBaseUrl = "/auth";

export const userApi = {
    registerUser: async (body: RegisterUserParams) => {
        const instance = axiosInstance();

        const { data } = await instance.post(`${baseUrl}/register`, body);

        return data;
    },

    getUsers: async ({ role, profile }: GetUsers) => {
        const instance = axiosInstance();
        const params: any = {};

        if (role) params.role = Array.isArray(role) ? role.join(",") : role;
        if (profile) params.profile = Array.isArray(profile) ? profile.join(",") : profile;

        const { data } = await instance.get(`${baseUrl}/`, { params })

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
    }
}