import { UserLevel } from '@prisma/client';
import { Profile } from '@prisma/client';

export class ResponsePanelistUserDto {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string;
  profile: Profile;
  level: UserLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;

  constructor(user: {
    id: string;
    name: string;
    email: string;
    registrationNumber?: string;
    profile: Profile;
    level: UserLevel;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.registrationNumber = user.registrationNumber;
    this.profile = user.profile;
    this.level = user.level;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.isVerified = user.isVerified;
  }
}
