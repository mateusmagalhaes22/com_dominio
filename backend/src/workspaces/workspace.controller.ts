import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.entity';
import { WorkspaceDto } from './workspace.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<WorkspaceDto[]> {
    const workspaces = await this.workspaceService.findAll();
    return workspaces.map(w => new WorkspaceDto(w));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<WorkspaceDto | null> {
    const workspace = await this.workspaceService.findOne(+id);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { adminUser: number, users: number[] }): Promise<Workspace> {
    return this.workspaceService.createWithIds(body.adminUser, body.users);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { adminUser: number, users: number[] }): Promise<WorkspaceDto | null> {
    const workspace = await this.workspaceService.update(+id, body);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.workspaceService.remove(+id);
  }

  @Get(':id/condominiums')
  findCondominiums(@Param('id', ParseIntPipe) id: number) {
    return this.workspaceService.findCondominiums(id);
  }

  @Get(':id/condominiums/:condominiumId')
  findCondominiumById(@Param('id', ParseIntPipe) workspaceId: number, @Param('condominiumId', ParseIntPipe) condominiumId: number) {
    return this.workspaceService.findCondominiumsByWorkspaceIdAndCondominiumId(workspaceId, condominiumId);
  }

  @Post(':id/condominiums')
  createCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CondominiumDto,
  ) {
    const { workspaceId, ...data } = dto;
    return this.workspaceService.createCondominium(id, data);
  }

  @Put(':id/condominiums/:condominiumId')
  updateCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Body() dto: CondominiumDto,
  ) {
    const { workspaceId, ...data } = dto;
    return this.workspaceService.updateCondominium(id, condominiumId, data);
  }

  @Delete(':id/condominiums/:condominiumId')
  deleteCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
  ) {
    return this.workspaceService.removeCondominium(id, condominiumId);
  }
}
