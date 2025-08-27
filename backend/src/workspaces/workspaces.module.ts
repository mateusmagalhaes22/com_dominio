import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';
import { Maintenance } from './condominium/maintenances/maintenance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, Condominium, Maintenance])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspacesModule {}
