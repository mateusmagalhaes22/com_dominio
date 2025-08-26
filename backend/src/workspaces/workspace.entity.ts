import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User)
  adminUser: User;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Condominium, (condominium) => condominium.workspace)
  condominiums: Condominium[];
}
