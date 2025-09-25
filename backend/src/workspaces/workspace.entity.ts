import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  adminUser: User;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @OneToMany(() => Condominium, (condominium) => condominium.workspace, { onDelete: 'CASCADE' })
  condominiums: Condominium[];
}
