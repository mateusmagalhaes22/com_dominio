import { Injectable } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createWithIds(adminUserId: number, userIds: number[]): Promise<Workspace> {
    const adminUser = await this.userRepository.findOneBy({ id: adminUserId });
    if (!adminUser) {
      throw new Error('Admin user not found');
    }
    const users = userIds.length > 0 ? await this.userRepository.findByIds(userIds) : [];
    const workspace = this.workspaceRepository.create({ adminUser, users });
    const savedWorkspace = await this.workspaceRepository.save(workspace);
    const fullWorkspace = await this.workspaceRepository.findOne({
      where: { id: savedWorkspace.id },
      relations: ['adminUser', 'users']
    });
    if (!fullWorkspace) {
      throw new Error('Failed to create workspace');
    }
    return fullWorkspace;
  }

  findAll(): Promise<Workspace[]> {
  return this.workspaceRepository.find({ relations: ['adminUser', 'users'] });
  }

  findOne(id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
  }

  async create(workspace: Workspace): Promise<Workspace> {
    return this.workspaceRepository.save(workspace);
  }

  async update(id: number, workspace: { adminUser: number, users: number[] }): Promise<Workspace | null> {
    let existingWorkspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
    
    if (!existingWorkspace) {
      return null;
    }
    
    if (workspace.adminUser) {
      const newAdminUser = await this.userRepository.findOneBy({ id: workspace.adminUser });
      if (!newAdminUser) {
        throw new Error('Admin user not found');
      }
      existingWorkspace.adminUser = newAdminUser;
    }

    if (workspace.users) {
      const newUsers = await this.userRepository.findByIds(workspace.users);
      existingWorkspace.users = newUsers;
    }

    await this.workspaceRepository.save(existingWorkspace);
    return this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
  }

  async remove(id: number): Promise<void> {
    await this.workspaceRepository.delete(id);
  }
}
