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

  toDto(): CondominiumDto {
    const dto = new CondominiumDto();
    dto.name = this.name as string;
    dto.cnpj = this.cnpj as string;
    dto.address = this.address as string;
    dto.workspaceId = this.workspace?.id || 0;
    dto.units = this.units;
    dto.maintenanceAmount = this.maintenances ? this.maintenances.length : 0;
    
    return dto;
  }
}
