import { Injectable, ConflictException, OnModuleInit } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { loginConstants } from '../login/constants';
import { Workspace } from 'src/workspaces/workspace.entity';

@Injectable()
export class UserService implements OnModuleInit {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      await this.create({
        name: 'Admin',
        email: loginConstants.adminUser,
        password: loginConstants.adminPassword,
      });
      console.log('🚀 Usuário admin criado');
    }
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'name', 'email']
    });
  }

  findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email']
    });
  }

  async create(user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({ 
      where: { email: user.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    user.password = await bcrypt.hash(user.password, 10);

    const createdUser = await this.userRepository.save(user);
    
    // Create and save workspace properly
    const workspace = this.workspaceRepository.create({ adminUser: createdUser });
    await this.workspaceRepository.save(workspace);

    return createdUser;
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {

    const updateData = { ...user };
    delete updateData.id;

    if (Object.keys(updateData).length === 0) {
      return this.userRepository.findOne({
        where: { id },
        select: ['id', 'name', 'email']
      });
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.userRepository.update(id, updateData);
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email']
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
