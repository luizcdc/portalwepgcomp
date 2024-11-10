import { Profile, UserAccount, UserLevel } from '@prisma/client';

export class ResponseUserDto {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string;
  photoFilePath?: string;
  profile: Profile;
  level: UserLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserAccount) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.registrationNumber = user.registrationNumber;
    this.photoFilePath = user.photoFilePath;
    this.profile = user.profile;
    this.level = user.level;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
