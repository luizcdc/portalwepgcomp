import { UUID } from "crypto";

type ProfileType = "Professor" | "DoctoralStudent" | "Listener";
type RoleType = "Superadmin" | "Admin" | "Default";

export interface GetUserParams {
    profile?: ProfileType | ProfileType[];
    role?: RoleType | RoleType[];
}

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

export interface User extends RegisterUserParams {
    id: UUID,
    createdAt: Date;
    deletedAt: Date;
    updatedAt: Date;
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
    id: UUID;
    name: string;
    profile: string;
    level: string;
    isActive: boolean;
}