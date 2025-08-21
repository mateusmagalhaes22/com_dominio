import { User } from '../users/user.entity';

export class Workspace {
  id?: number;
  adminUser: User;
  users: User[];
}
