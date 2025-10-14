import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, UseInterceptors, Headers, BadRequestException } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceDto } from './workspace.dto';
import { JwtAuthGuard } from 'src/login/jwt-auth.guard';
import { WorkspaceAccessGuard } from 'src/login/workspace-access.guard';
import { CurrentUser, type AuthUser } from 'src/login/current-user.decorator';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';
import { MaintenanceDto } from './condominium/maintenances/maintenance-dto';
import { IdempotencyInterceptor } from 'src/idempotency/idempotency.interceptor';
import { ActivityType } from './activity-log/activity-log.entity';

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
  async createCondominium(@Param('id') id: number, @Body() body: any, @CurrentUser() user: AuthUser) {
    const formData = body.formData || body;
    const condominiumData = {
      name: formData.name,
      cnpj: formData.cnpj,
      address: formData.address,
      units: formData.units,
      phone: formData.phone
    };
    
    const condominium = await this.workspaceService.createCondominium(id, condominiumData);
    
    await this.workspaceService.createActivityLog(
      id,
      user.userId,
      ActivityType.CONDOMINIUM_CREATED,
      'Condomínio adicionado:',
      condominiumData.name,
      condominium.id
    );
    
    return condominium;
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
  async deleteCondominium(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @CurrentUser() user: AuthUser
  ) {

    const condominium = await this.workspaceService.findCondominiumsByWorkspaceIdAndCondominiumId(workspaceId, condominiumId);
    
    const result = await this.workspaceService.removeCondominium(workspaceId, condominiumId);
    
    if (condominium) {
      await this.workspaceService.createActivityLog(
        workspaceId,
        user.userId,
        ActivityType.CONDOMINIUM_DELETED,
        'Condomínio excluído:',
        condominium.name,
        condominiumId
      );
    }
    
    return result;
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/condominiums/:condominiumId/maintenances')
  async findMaintenances(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Headers('Status') status?: string,
  ) {
    const maintenances = await this.workspaceService.findMaintenances(workspaceId, condominiumId, status);
    
    return maintenances.map(maintenance => ({
      ...maintenance,
      condominiumName: maintenance.condominium?.name || 'N/A'
    }));
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/condominiums/:condominiumId/maintenances/count')
  findMaintenancesCount(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Headers('Status') status?: string,
  ) {
    return this.workspaceService.findMaintenancesCount(workspaceId, condominiumId, status);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Post(':id/condominiums/:condominiumId/maintenances')
  @UseInterceptors(IdempotencyInterceptor)
  async createMaintenance(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Body() dto: MaintenanceDto,
    @CurrentUser() user: AuthUser
  ) {
    const maintenance = await this.workspaceService.createMaintenance(condominiumId, dto);
    
    const maintenanceName = maintenance.name || dto.name || 'Manutenção';
    const condominiumName = dto.condominiumName || maintenance.condominium?.name || 'Condomínio';
    const entityName = `${maintenanceName} - ${condominiumName}`;
    
    await this.workspaceService.createActivityLog(
      workspaceId,
      user.userId,
      ActivityType.MAINTENANCE_CREATED,
      'Manutenção criada:',
      entityName,
      maintenance.id
    );
    
    return maintenance;
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Put(':id/condominiums/:condominiumId/maintenances/:maintenanceId')
  async updateMaintenance(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
    @Body() dto: MaintenanceDto,
    @CurrentUser() user: AuthUser
  ) {
    const maintenance = await this.workspaceService.updateMaintenance(condominiumId, maintenanceId, dto);
    
    if (dto.status === 'feito' as any && maintenance) {
      const maintenanceName = maintenance.name || dto.name || 'Manutenção';
      const condominiumName = dto.condominiumName || maintenance.condominium?.name || 'Condomínio';
      const entityName = `${maintenanceName} - ${condominiumName}`;
      await this.workspaceService.createActivityLog(
        workspaceId,
        user.userId,
        ActivityType.MAINTENANCE_COMPLETED,
        'Manutenção concluída:',
        entityName,
        maintenance.id
      );
    }
    
    if (maintenance && maintenance.condominium) {
      return {
        ...maintenance,
        condominiumName: maintenance.condominium.name
      };
    }
    
    return maintenance;
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Delete(':id/condominiums/:condominiumId/maintenances/:maintenanceId')
  async deleteMaintenance(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Param('condominiumId', ParseIntPipe) condominiumId: number,
    @Param('maintenanceId', ParseIntPipe) maintenanceId: number,
    @CurrentUser() user: AuthUser
  ) {
    const result = await this.workspaceService.removeMaintenance(condominiumId, maintenanceId);
    
    if (result.deletedMaintenance) {
      const maintenanceName = result.deletedMaintenance.name || 'Manutenção';
      const condominiumName = result.deletedMaintenance.condominium?.name || 'Condomínio';
      const entityName = `${maintenanceName} - ${condominiumName}`;
      
      await this.workspaceService.createActivityLog(
        workspaceId,
        user.userId,
        ActivityType.MAINTENANCE_DELETED,
        'Manutenção excluída:',
        entityName,
        maintenanceId
      );
    }
    
    return result.deleteResult;
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-overdue-maintenances')
  updateOverdueMaintenances(@CurrentUser() user: AuthUser) {
    return this.workspaceService.updateOverdueMaintenances();
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Get(':id/activities')
  getRecentActivities(@Param('id', ParseIntPipe) id: number) {
    return this.workspaceService.getRecentActivities(id, 10);
  }

  @UseGuards(JwtAuthGuard, WorkspaceAccessGuard)
  @Post(':id/activities/log')
  async logActivity(
    @Param('id', ParseIntPipe) workspaceId: number,
    @Body() body: { type: string; description: string; entityName: string },
    @CurrentUser() user: AuthUser
  ) {
    await this.workspaceService.createActivityLog(
      workspaceId,
      user.userId,
      body.type as ActivityType,
      body.description,
      body.entityName
    );
    
    return { success: true };
  }
}
