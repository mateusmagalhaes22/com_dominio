import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, UseInterceptors, Headers, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDto } from './workspace.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';
import { MaintenanceDto } from './condominium/maintenances/maintenance-dto';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Headers('Idempotency-Key') idempotencyKey: string): Promise<WorkspaceDto[]> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const workspaces = await this.workspaceService.findAll();
    return workspaces.map(w => new WorkspaceDto(w));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string): Promise<WorkspaceDto | null> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const workspace = await this.workspaceService.findOne(+id);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string, @Body() body: { adminUser: number, users: number[] }): Promise<WorkspaceDto | null> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
    const workspace = await this.workspaceService.update(+id, body);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Headers('Idempotency-Key') idempotencyKey: string, @Param('id') id: string): Promise<void> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }
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
  @UseInterceptors(IdempotencyInterceptor)
  createCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CondominiumDto
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

  @Get(':workspaceId/condominiums/:condominiumId/maintenances')
  findMaintenances(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
  ) {
    return this.workspaceService.findMaintenances(workspaceId, condominiumId);
  }

  @Post(':id/condominiums/:condominiumId/maintenances')
  @UseInterceptors(IdempotencyInterceptor)
  createMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Body() body: { description: string; date: Date; cost: number }
  ) {
    return this.workspaceService.createMaintenance(condominiumId, body);
  }

  @Put(':workspaceId/condominiums/:condominiumId/maintenances/:maintenanceId')
  updateMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
    @Body() dto: MaintenanceDto,
  ) {
    return this.workspaceService.updateMaintenance(condominiumId, maintenanceId, dto);
  }

  @Delete(':workspaceId/condominiums/:condominiumId/maintenances/:maintenanceId')
  deleteMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
  ) {
    return this.workspaceService.removeMaintenance(condominiumId, maintenanceId);
  }
}
