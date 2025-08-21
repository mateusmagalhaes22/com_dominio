import { User } from '../users/user.entity';

export class UserDto {
  id: number;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.id!;
    this.name = user.name;
    this.email = user.email;
  }
}
