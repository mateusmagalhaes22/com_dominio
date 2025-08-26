import { User } from '../users/user.entity';

export class LoginUserDto {
  email: string;
  password: string;

  constructor(user: User) {
    this.email = user.email;
    this.password = user.password;
  }
}
