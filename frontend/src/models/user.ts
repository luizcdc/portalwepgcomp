/* eslint-disable @typescript-eslint/no-unused-vars */

interface RegisterUserParams {
    name: string,
    email: string,
    password: string,
    photoFilePath: string,
    profile: "Professor" | "Student",
    areaExpertise: string,
    biography: string,
    registration: string
}

interface User extends RegisterUserParams{
    id: string,
    createdAt: string;
    deletedAt: string;
    updatedAt: string;
}