import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, UseInterceptors, Headers, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDto } from './workspace.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { WorkspaceAccessGuard } from 'src/login/workspace-access.guard';
import { WorkspaceIdAccessGuard } from 'src/login/workspace-id-access.guard';
import { CurrentUser, type AuthUser } from 'src/login/current-user.decorator';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';
import { MaintenanceDto } from './condominium/maintenances/maintenance-dto';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}


  @Get()
  async findAll(@Headers('admin-key') adminKey: string, @CurrentUser() user: AuthUser): Promise<WorkspaceDto[]> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new BadRequestException('Invalid admin key for workspace access');
    }

    const workspaces = await this.workspaceService.findAll();
    return workspaces.map(workspace => new WorkspaceDto(workspace));
  }

  @Get(':id')
  async findOne(@Headers('admin-key') adminKey: string, @Param('id') id: string): Promise<WorkspaceDto | null> {
    const validAdminKey = process.env.ADMIN_KEY;
    
    if (!adminKey || adminKey !== validAdminKey) {
      throw new BadRequestException('Invalid admin key for workspace access');
    }

    const workspace = await this.workspaceService.findOne(+id);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { adminUser: number, users: number[] }): Promise<WorkspaceDto | null> {
    const workspace = await this.workspaceService.update(+id, body);
    return workspace ? new WorkspaceDto(workspace) : null;
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.workspaceService.remove(+id);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/condominiums')
  findCondominiums(@Param('id', ParseIntPipe) id: number) {
    return this.workspaceService.findCondominiums(id);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/condominiums/count')
  findCondominiumsCount(@Param('id', ParseIntPipe) id: number) {
    return this.workspaceService.findCondominiumsCount(id);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/maintenances/count')
  findWorkspaceMaintenancesCount(
    @Param('id', ParseIntPipe) id: number,
    @Headers('Status') status?: string,
  ) {
    return this.workspaceService.findWorkspaceMaintenancesCount(id, status);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/condominiums/:condominiumId')
  findCondominiumById(@Param('id', ParseIntPipe) workspaceId: number, @Param('condominiumId', ParseIntPipe) condominiumId: number) {
    return this.workspaceService.findCondominiumsByWorkspaceIdAndCondominiumId(workspaceId, condominiumId);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Post(':id/condominiums')
  @UseInterceptors(IdempotencyInterceptor)
  createCondominium(@Param('id') id: number, @Body() body: any) {
    // Extract data from the correct structure
    const formData = body.formData || body;
    const condominiumData = {
      name: formData.name,
      cnpj: formData.cnpj,
      address: formData.address,
      units: formData.units
      // pendingMaintenanceAmount and overdueMaintenanceAmount are calculated automatically
    };
    
    return this.workspaceService.createCondominium(id, condominiumData);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Put(':id/condominiums/:condominiumId')
  updateCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Body() dto: CondominiumDto,
  ) {
    const { workspaceId, ...data } = dto;
    return this.workspaceService.updateCondominium(id, condominiumId, data);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Delete(':id/condominiums/:condominiumId')
  deleteCondominium(
    @Param('id', ParseIntPipe) id: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
  ) {
    return this.workspaceService.removeCondominium(id, condominiumId);
  }

  @UseGuards(JwtAuthGuard, WorkspaceIdAccessGuard)
  @Get(':workspaceId/condominiums/:condominiumId/maintenances')
  findMaintenances(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Headers('Status') status?: string,
  ) {
    return this.workspaceService.findMaintenances(workspaceId, condominiumId, status);
  }

  @UseGuards(JwtAuthGuard, WorkspaceIdAccessGuard)
  @Get(':workspaceId/condominiums/:condominiumId/maintenances/count')
  findMaintenancesCount(
    @Param('workspaceId', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Headers('Status') status?: string,
  ) {
    return this.workspaceService.findMaintenancesCount(workspaceId, condominiumId, status);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Post(':id/condominiums/:condominiumId/maintenances')
  @UseInterceptors(IdempotencyInterceptor)
  createMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Body() dto: MaintenanceDto
  ) {
    return this.workspaceService.createMaintenance(condominiumId, dto);
  }

  @UseGuards(JwtAuthGuard, WorkspaceIdAccessGuard)
  @Put(':workspaceId/condominiums/:condominiumId/maintenances/:maintenanceId')
  updateMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
    @Body() dto: MaintenanceDto,
  ) {
    return this.workspaceService.updateMaintenance(condominiumId, maintenanceId, dto);
  }

  @UseGuards(JwtAuthGuard, WorkspaceIdAccessGuard)
  @Delete(':workspaceId/condominiums/:condominiumId/maintenances/:maintenanceId')
  deleteMaintenance(
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
  ) {
    return this.workspaceService.removeMaintenance(condominiumId, maintenanceId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-overdue-maintenances')
  updateOverdueMaintenances(@CurrentUser() user: AuthUser) {
    return this.workspaceService.updateOverdueMaintenances();
  }
}
