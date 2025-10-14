import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';
import { User } from 'src/users/user.entity';

export enum ActivityType {
  MAINTENANCE_CREATED = 'maintenance_created',
  MAINTENANCE_COMPLETED = 'maintenance_completed',
  MAINTENANCE_DELETED = 'maintenance_deleted',
  MAINTENANCE_AUTO_CREATED = 'maintenance_auto_created',
  CONDOMINIUM_CREATED = 'condominium_created',
  CONDOMINIUM_DELETED = 'condominium_deleted',
  REPORT_GENERATED = 'report_generated'
}

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  type: ActivityType;

  @Column()
  description: string;

  @Column()
  entityName: string;

  @Column({ nullable: true })
  entityId?: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Workspace, { onDelete: 'CASCADE' })
  workspace: Workspace;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = new Date();
  }
}