/* eslint-disable @typescript-eslint/no-unused-vars */
type ProfileType = "Professor" | "DoctoralStudent" | "Listener";

interface RegisterUserParams {
    name: string,
    email: string,
    password: string,
    photoFilePath?: string,
    profile: ProfileType,
    areaExpertise?: string,
    biography?: string,
    registrationNumber?: string
}

interface User extends RegisterUserParams{
    id: string,
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}

interface ResetPasswordSendEmailParams {
    email: string,
}

interface ResetPasswordParams {
    token: string,
    newPassword: string,
}

interface UserLogin {
    email: string,
    password: string
}

interface UserProfile {
    name: string;
    profile: string;
    level: string;
    isActive: boolean;
  }