import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { loginConstants } from '../login/constants';
import { Workspace } from 'src/workspaces/workspace.entity';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async onModuleInit() {
    const count = await this.userRepository.count();
    if (count === 0) {
      this.create({
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
    user.password = await bcrypt.hash(user.password, 10);

    const createdUser = this.userRepository.save(user);
    this.workspaceRepository.create({ adminUser: user });
    this.workspaceRepository.save({ adminUser: user });

    return createdUser;
  }

  async update(id: number, user: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, user);
    return this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'email']
    });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
