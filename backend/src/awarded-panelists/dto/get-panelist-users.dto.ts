import { UserLevel } from "@prisma/client";
import { Profile } from "@prisma/client";

export class GetPanelistUsersDto {
    id: string;
    name: string;
    email: string;
    registrationNumber: string;
    photoFilePath: string;
    profile: Profile;
    level: UserLevel;
}