import { UserLevel } from '@prisma/client';
import { Profile } from '@prisma/client';

export class ResponsePanelistUserDto {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  photoFilePath: string;
  profile: Profile;
  level: UserLevel;

  constructor(user: {
    id: string;
    name: string;
    email: string;
    registrationNumber: string;
    photoFilePath: string;
    profile: Profile;
    level: UserLevel;
  }) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.registrationNumber = user.registrationNumber;
    this.photoFilePath = user.photoFilePath;
    this.profile = user.profile;
    this.level = user.level;
  }
}
