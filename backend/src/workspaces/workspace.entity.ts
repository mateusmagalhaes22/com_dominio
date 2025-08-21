import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  adminUser: User;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];
}
