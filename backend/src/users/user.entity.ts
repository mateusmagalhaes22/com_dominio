
import { Workspace } from 'src/workspaces/workspace.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
