import { Workspace } from './workspace.entity';
import { UserDto } from '../users/user.dto';

export class WorkspaceDto {
  id: number;
  adminUser: UserDto | null;
  users: UserDto[];

  constructor(workspace: Workspace) {
    this.id = workspace.id!;
  this.adminUser = workspace.adminUser ? new UserDto(workspace.adminUser) : null;
    this.users = workspace.users ? workspace.users.map(u => new UserDto(u)) : [];
  }
}
