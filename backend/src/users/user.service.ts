import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];
  private idCounter = 1;

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }

  findOne(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.find(u => u.id === id));
  }

  create(user: User): Promise<User> {
    user.id = this.idCounter++;
    this.users.push(user);
    return Promise.resolve(user);
  }

  update(id: number, user: User): Promise<User | undefined> {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx > -1) {
      this.users[idx] = { ...this.users[idx], ...user };
      return Promise.resolve(this.users[idx]);
    }
    return Promise.resolve(undefined);
  }

  remove(id: number): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
    return Promise.resolve();
  }
}
