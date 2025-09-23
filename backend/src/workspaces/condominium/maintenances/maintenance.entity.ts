import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { Condominium } from '../condominium.entity';
import { MaintenanceStatus } from './maintenance-status.enum';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: String;

  @Column()
  description: String;

  @Column({nullable: true})
  endDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDENTE
  })
  status: MaintenanceStatus;

  @ManyToOne(() => Condominium, (condominium) => condominium.maintenances, { onDelete: 'CASCADE' })
  condominium: Condominium;

  @BeforeInsert()
  @BeforeUpdate()
  calculateStatus() {
    const currentDate = new Date();

    if (this.endDate && this.endDate < currentDate && this.status !== MaintenanceStatus.FEITO) {
      this.status = MaintenanceStatus.ATRASADO;
    } else if (this.endDate && this.endDate >= currentDate && this.status !== MaintenanceStatus.FEITO) {
      this.status = MaintenanceStatus.PENDENTE;
    }
  }
}
