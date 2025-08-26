import { User } from '../users/user.entity';
import { IsNotEmpty, IsString, IsNumber, isString } from 'class-validator';

export class UserDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  constructor(user: User) {
    this.id = user.id!;
    this.name = user.name;
    this.email = user.email;
  }
}
