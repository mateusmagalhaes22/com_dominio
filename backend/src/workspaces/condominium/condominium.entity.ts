import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { Maintenance } from './maintenances/maintenance.entity';
import { CondominiumDto } from './condominium-dto';

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

  @Column()
  units: number;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.condominium)
  maintenances: Maintenance[];

  @ManyToOne(() => Workspace, (workspace) => workspace.condominiums, { onDelete: 'CASCADE' })
  workspace: Workspace;

  toDto(): any {
    return {
      id: this.id,
      name: this.name as string,
      cnpj: this.cnpj as string,
      address: this.address as string,
      workspaceId: this.workspace?.id || 0,
      units: this.units || 0,
      maintenanceAmount: this.maintenances ? this.maintenances.length : 0
    };
  }
}
