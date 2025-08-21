import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.entity';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  findAll(): Promise<Workspace[]> {
    return this.workspaceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Workspace | null> {
    return this.workspaceService.findOne(+id);
  }

  @Post()
  create(@Body() workspace: Workspace): Promise<Workspace> {
    return this.workspaceService.create(workspace);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() workspace: Workspace): Promise<Workspace | null> {
    return this.workspaceService.update(+id, workspace);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workspaceService.remove(+id);
  }
}
