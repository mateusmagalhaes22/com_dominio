import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';
import { Maintenance } from './condominium/maintenances/maintenance.entity';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, Condominium, Maintenance]), IdempotencyModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  exports: [WorkspaceService],
})
export class WorkspacesModule {}
