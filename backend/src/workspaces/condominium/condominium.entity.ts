import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { Maintenance } from './maintenances/maintenance.entity';

@Entity()
export class Condominium {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: String;

  @Column({ unique: true })
  cnpj: String;

  @Column()
  address: String;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.condominium)
  maintenances: Maintenance[];

  @ManyToOne(() => Workspace, (workspace) => workspace.condominiums, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
