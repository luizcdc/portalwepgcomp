type ProfileType = "Professor" | "DoctoralStudent" | "Listener";

export interface RegisterUserParams {
    name: string,
    email: string,
    password: string,
    photoFilePath?: string,
    profile: ProfileType,
    areaExpertise?: string,
    biography?: string,
    registrationNumber?: string
}

export interface User extends RegisterUserParams{
    id: string,
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}

export interface ResetPasswordSendEmailParams {
    email: string,
}

export interface ResetPasswordParams {
    token: string,
    newPassword: string,
}

export interface UserLogin {
    email: string,
    password: string
}

export interface UserProfile {
    name: string;
    profile: string;
    level: string;
    isActive: boolean;
  }