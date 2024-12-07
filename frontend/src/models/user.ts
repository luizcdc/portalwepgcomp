import { UUID } from "crypto";

type ProfileType = "Professor" | "DoctoralStudent" | "Listener";
type RoleType = "Superadmin" | "Admin" | "Default";

export interface GetUsers {
    role?: RoleType | RoleType[];
    profile?: ProfileType | ProfileType[];
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