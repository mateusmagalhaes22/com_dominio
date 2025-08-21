import { Injectable } from '@nestjs/common';
import { Workspace } from './workspace.entity';

@Injectable()
export class WorkspaceService {
  private workspaces: Workspace[] = [];
  private idCounter = 1;

  findAll(): Promise<Workspace[]> {
    return Promise.resolve(this.workspaces);
  }

  findOne(id: number): Promise<Workspace | null> {
    const workspace = this.workspaces.find(w => w.id === id);
    return Promise.resolve(workspace ?? null);
  }

  create(workspace: Workspace): Promise<Workspace> {
    workspace.id = this.idCounter++;
    this.workspaces.push(workspace);
    return Promise.resolve(workspace);
  }

  update(id: number, workspace: Workspace): Promise<Workspace | null> {
    const idx = this.workspaces.findIndex(w => w.id === id);
    if (idx > -1) {
      this.workspaces[idx] = { ...this.workspaces[idx], ...workspace };
      return Promise.resolve(this.workspaces[idx]);
    }
    return Promise.resolve(null);
  }

  remove(id: number): Promise<void> {
    this.workspaces = this.workspaces.filter(w => w.id !== id);
    return Promise.resolve();
  }
}
