import { Module } from '@nestjs/common';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace, User, Condominium])],
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
})
export class WorkspacesModule {}
