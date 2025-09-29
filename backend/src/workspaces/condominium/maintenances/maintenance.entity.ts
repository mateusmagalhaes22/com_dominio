import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { Condominium } from '../condominium.entity';
import { MaintenanceStatus } from './maintenance-status.enum';
import { RecurringPeriod } from './recurring-period.enum';

@Entity()
export class Maintenance {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: String;

  @Column()
  description: String;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({nullable: true})
  endDate: Date;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDENTE
  })
  status: MaintenanceStatus;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({
    type: 'enum',
    enum: RecurringPeriod,
    nullable: true
  })
  recurringPeriod?: RecurringPeriod;

  @Column({ nullable: true })
  nextRecurrenceDate?: Date;

  @Column({ nullable: true })
  parentMaintenanceId?: number;

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

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdateDate() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  @BeforeUpdate()
  calculateNextRecurrenceDate() {
    // Se não é recorrente, limpar campos relacionados
    if (!this.isRecurring) {
      this.recurringPeriod = undefined;
      this.nextRecurrenceDate = undefined;
      return;
    }

    if (this.isRecurring && this.recurringPeriod && this.endDate) {
      const baseDate = new Date(this.endDate);
      const nextDate = new Date(baseDate);

      switch (this.recurringPeriod) {
        case RecurringPeriod.ONE_MONTH:
          // Próxima manutenção 1 mês após a data de prazo, com antecedência de 1 semana
          nextDate.setMonth(nextDate.getMonth() + 1);
          nextDate.setDate(nextDate.getDate() - 7);
          break;
        case RecurringPeriod.SIX_MONTHS:
          // Próxima manutenção 6 meses após a data de prazo, com antecedência de 2 semanas
          nextDate.setMonth(nextDate.getMonth() + 6);
          nextDate.setDate(nextDate.getDate() - 14);
          break;
        case RecurringPeriod.ONE_YEAR:
          // Próxima manutenção 1 ano após a data de prazo, com antecedência de 30 dias
          nextDate.setFullYear(nextDate.getFullYear() + 1);
          nextDate.setDate(nextDate.getDate() - 30);
          break;
      }

      this.nextRecurrenceDate = nextDate;
    }
  }
}
