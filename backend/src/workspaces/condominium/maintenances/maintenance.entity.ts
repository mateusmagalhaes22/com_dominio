import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { Condominium } from '../condominium.entity';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: String;

  @Column()
  description: String;

  @Column({nullable: true})
  startDate: Date;

  @Column({nullable: true})
  endDate: Date;

  @ManyToOne(() => Condominium, (condominium) => condominium.maintenances, { onDelete: 'CASCADE' })
  condominium: Condominium;
}
