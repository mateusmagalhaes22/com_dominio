import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.entity';
import { WorkspaceDto } from './workspace.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async findAll(): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspaceService.findAll();
    return workspaces.map(w => new WorkspaceDto(w));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkspaceDto | null> {
    const workspace = await this.workspaceService.findOne(+id);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @Post()
  create(@Body() body: { adminUser: number, users: number[] }): Promise<Workspace> {
    return this.workspaceService.createWithIds(body.adminUser, body.users);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { adminUser: number, users: number[] }): Promise<WorkspaceDto | null> {
    const workspace = await this.workspaceService.update(+id, body);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workspaceService.remove(+id);
  }
}
