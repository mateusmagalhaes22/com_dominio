import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Workspace } from 'src/workspaces/workspace.entity';

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

  @ManyToOne(() => Workspace, (workspace) => workspace.condominiums, { onDelete: 'CASCADE' })
  workspace: Workspace;
}
