import { Injectable, NotFoundException } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';
import { Maintenance } from './condominium/maintenances/maintenance.entity';
import { MaintenanceStatus } from './condominium/maintenances/maintenance-status.enum';
import { RecurringPeriod } from './condominium/maintenances/recurring-period.enum';
import { ActivityLog, ActivityType } from './activity-log/activity-log.entity';
import { ActivityLogDto } from './activity-log/activity-log.dto';

@Injectable()
export class WorkspaceService {

  constructor(
    @InjectRepository(Workspace)
    private readonly workspaceRepository: Repository<Workspace>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Condominium)
    private readonly condominiumRepository: Repository<Condominium>,

    @InjectRepository(Maintenance)
    private readonly maintenanceRepository: Repository<Maintenance>,

    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(adminUserId: number): Promise<Workspace> {
    const adminUser = await this.userRepository.findOneBy({ id: adminUserId });
    
    if (!adminUser) {
      throw new NotFoundException('Admin user not found');
    }
    
    const workspace = this.workspaceRepository.create({ adminUser });
    const savedWorkspace = await this.workspaceRepository.save(workspace);
    
    const fullWorkspace = await this.workspaceRepository.findOne({
      where: { id: savedWorkspace.id },
      relations: ['adminUser', 'users']
    });
    
    if (!fullWorkspace) {
      throw new NotFoundException('Failed to create workspace');
    }
    
    return fullWorkspace;
  }

  findAll(): Promise<Workspace[]> {
  return this.workspaceRepository.find({ relations: ['adminUser', 'users'] });
  }

  findOne(id: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
  }

  async update(id: number, workspace: { adminUser: number, users: number[] }): Promise<Workspace | null> {
    let existingWorkspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
    
    if (!existingWorkspace) {
      return null;
    }
    
    if (workspace.adminUser) {
      const newAdminUser = await this.userRepository.findOneBy({ id: workspace.adminUser });
      if (!newAdminUser) {
        throw new NotFoundException('Admin user not found');
      }
      existingWorkspace.adminUser = newAdminUser;
    }

    if (workspace.users) {
      const newUsers = await this.userRepository.findByIds(workspace.users);
      existingWorkspace.users = newUsers;
    }

    await this.workspaceRepository.save(existingWorkspace);
    return this.workspaceRepository.findOne({
      where: { id },
      relations: ['adminUser', 'users']
    });
  }

  async remove(id: number): Promise<void> {
    await this.workspaceRepository.delete(id);
  }

  async findByUserId(userId: number): Promise<Workspace | null> {
    return this.workspaceRepository.findOne({
      where: [
        { adminUser: { id: userId } },
        { users: { id: userId } }
      ],
      relations: ['adminUser', 'users']
    });
  }

  async findCondominiums(id: number): Promise<CondominiumDto[]> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id },
      relations: ['condominiums', 'condominiums.maintenances'],
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${id} not found`);
    }

    return workspace.condominiums.map(condominium => condominium.toDto());
  }

  async findCondominiumsCount(id: number): Promise<number> {
    const count = await this.condominiumRepository.count({
      where: { workspace: { id } },
    });

    return count;
  }

  async findCondominiumsByWorkspaceIdAndCondominiumId(workspaceId: number, condominiumId: number): Promise<CondominiumDto | null> {
    const condominium = await this.condominiumRepository.findOne({
      where: { id: condominiumId, workspace: { id: workspaceId } },
      relations: ['maintenances', 'workspace'],
    });

    if (!condominium) {
      return null;
    }

    return condominium.toDto();
  }
  
  async createCondominium(workspaceId: number, data: Partial<Condominium>): Promise<Condominium> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });

    if (!workspace) {
      throw new NotFoundException(`Workspace with ID ${workspaceId} not found`);
    }

    const condominium = this.condominiumRepository.create({
      ...data,
      workspace,
    });

    return this.condominiumRepository.save(condominium);
  }

  updateCondominium(id: number, condominiumId: number, data: { name: string; cnpj: string; address: string; phone?: string; units?: number; }) {
    const updateData = { ...data };
    if (Object.keys(updateData).length === 0) {
      return this.condominiumRepository.findOne({ where: { id: condominiumId, workspace: { id } } });
    }
    
    return this.condominiumRepository.update({ id: condominiumId, workspace: { id } }, updateData).then(() => {
      return this.condominiumRepository.findOne({ where: { id: condominiumId, workspace: { id } } });
    });
  }

  removeCondominium(id: number, condominiumId: number) {
    return this.condominiumRepository.delete({ id: condominiumId, workspace: { id } });
  }

  async createMaintenance(condominiumId: number, data: Partial<Maintenance>): Promise<Maintenance> {
    const condominium = await this.condominiumRepository.findOne({ where: { id: condominiumId } });

    if (!condominium) {
      throw new NotFoundException(`Condominium with ID ${condominiumId} not found`);
    }

    const processedData = { ...data };
    if (processedData.endDate) {
      if (typeof processedData.endDate === 'string') {
        processedData.endDate = new Date(processedData.endDate);
      }
      
      if (isNaN(processedData.endDate.getTime()) || processedData.endDate.toString() === 'Invalid Date') {
        processedData.endDate = undefined;
      }
    }

    if (!processedData.isRecurring) {
      processedData.recurringPeriod = undefined;
      processedData.nextRecurrenceDate = undefined;
    } else if ((processedData.recurringPeriod as any) === '') {
      processedData.recurringPeriod = undefined;
    }

    const maintenance = this.maintenanceRepository.create({
      ...processedData,
      condominium,
    });

    const savedMaintenance = await this.maintenanceRepository.save(maintenance);
    
    const maintenanceWithCondominium = await this.maintenanceRepository.findOne({
      where: { id: savedMaintenance.id },
      relations: ['condominium']
    });
    
    return maintenanceWithCondominium || savedMaintenance;
  }

  async findMaintenances(workspaceId: number, condominiumId: number, status?: string): Promise<Maintenance[]> {

    await this.updateOverdueMaintenances();
    
    const condominiumExists = await this.condominiumRepository.findOne({
      where: { id: condominiumId, workspace: { id: workspaceId } },
    });

    if (!condominiumExists) {
      throw new NotFoundException(`Condominium with ID ${condominiumId} not found`);
    }

    const whereCondition: any = {
      condominium: { id: condominiumId, workspace: { id: workspaceId } }
    };

    if (status && Object.values(MaintenanceStatus).includes(status as MaintenanceStatus)) {
      whereCondition.status = status as MaintenanceStatus;
    }

    const maintenances = await this.maintenanceRepository.find({
      where: whereCondition,
      relations: ['condominium']
    });

    return maintenances;
  }

  async findMaintenancesCount(workspaceId: number, condominiumId: number, status?: string): Promise<number> {
  
    await this.updateOverdueMaintenances();

    const whereCondition: any = {
      condominium: { id: condominiumId, workspace: { id: workspaceId } }
    };

    if (status && Object.values(MaintenanceStatus).includes(status as MaintenanceStatus)) {
      whereCondition.status = status as MaintenanceStatus;
    }

    const count = await this.maintenanceRepository.count({
      where: whereCondition,
    });

    return count;
  }

  updateMaintenance(condominiumId: number, maintenanceId: number, data: Partial<Maintenance>) {
    const updateData = { ...data };
    delete updateData.id;
    
    if (Object.keys(updateData).length === 0) {
      return this.maintenanceRepository.findOne({ 
        where: { id: maintenanceId, condominium: { id: condominiumId } },
        relations: ['condominium']
      });
    }
    
    return this.maintenanceRepository.update({ id: maintenanceId, condominium: { id: condominiumId } }, updateData).then(() => {
      return this.maintenanceRepository.findOne({ 
        where: { id: maintenanceId, condominium: { id: condominiumId } },
        relations: ['condominium']
      });
    });
  }

  async removeMaintenance(condominiumId: number, maintenanceId: number) {
    const maintenance = await this.maintenanceRepository.findOne({
      where: { id: maintenanceId, condominium: { id: condominiumId } },
      relations: ['condominium']
    });
    
    const result = await this.maintenanceRepository.delete({ id: maintenanceId, condominium: { id: condominiumId } });
    
    return { deletedMaintenance: maintenance, deleteResult: result };
  }

  async findWorkspaceMaintenancesCount(workspaceId: number, status?: string): Promise<number> {

    await this.updateOverdueMaintenances();
    
    const whereCondition: any = {
      condominium: { workspace: { id: workspaceId } }
    };

    if (status && Object.values(MaintenanceStatus).includes(status as MaintenanceStatus)) {
      whereCondition.status = status as MaintenanceStatus;
    }

    const count = await this.maintenanceRepository.count({
      where: whereCondition,
    });

    return count;
  }

  async updateOverdueMaintenances(): Promise<void> {
    const currentDate = new Date();
    
    const overdueMaintances = await this.maintenanceRepository.find({
      where: {
        status: MaintenanceStatus.PENDENTE,
        endDate: LessThan(currentDate)
      }
    });

    for (const maintenance of overdueMaintances) {
      maintenance.status = MaintenanceStatus.ATRASADO;
      await this.maintenanceRepository.save(maintenance);
    }
  }

  async createRecurringMaintenance(originalMaintenance: Maintenance): Promise<Maintenance> {
    if (!originalMaintenance.isRecurring || !originalMaintenance.recurringPeriod || !originalMaintenance.endDate) {
      throw new Error('Maintenance is not configured for recurrence');
    }

    const nextEndDate = new Date(originalMaintenance.endDate);
    
    // Calculate the next maintenance date based on period
    switch (originalMaintenance.recurringPeriod) {
      case RecurringPeriod.ONE_MONTH:
        nextEndDate.setMonth(nextEndDate.getMonth() + 1);
        break;
      case RecurringPeriod.SIX_MONTHS:
        nextEndDate.setMonth(nextEndDate.getMonth() + 6);
        break;
      case RecurringPeriod.ONE_YEAR:
        nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
        break;
    }

    const newMaintenance = this.maintenanceRepository.create({
      name: originalMaintenance.name,
      description: originalMaintenance.description,
      endDate: nextEndDate,
      isRecurring: originalMaintenance.isRecurring,
      recurringPeriod: originalMaintenance.recurringPeriod,
      parentMaintenanceId: originalMaintenance.id,
      condominium: originalMaintenance.condominium,
      status: MaintenanceStatus.PENDENTE
    });

    const savedMaintenance = await this.maintenanceRepository.save(newMaintenance);

    // Log the automatic creation activity
    // Use system user (id: 1) for automatic activities, or find the workspace admin
    const workspace = await this.workspaceRepository.findOne({
      where: { id: originalMaintenance.condominium.workspace.id },
      relations: ['adminUser']
    });

    if (workspace && workspace.adminUser && workspace.id && workspace.adminUser.id) {
      await this.createActivityLog(
        workspace.id,
        workspace.adminUser.id,
        ActivityType.MAINTENANCE_AUTO_CREATED,
        'Manutenção recorrente criada automaticamente:',
        originalMaintenance.name as string,
        savedMaintenance.id
      );
    }

    return savedMaintenance;
  }

  async checkAndCreateRecurringMaintenances(): Promise<void> {
    const currentDate = new Date();
    
    // Find all recurring maintenances that should create next occurrence
    const recurringMaintenances = await this.maintenanceRepository.find({
      where: {
        isRecurring: true,
        nextRecurrenceDate: LessThan(currentDate)
      },
      relations: ['condominium']
    });

    for (const maintenance of recurringMaintenances) {
      try {
        await this.createRecurringMaintenance(maintenance);
        
        // Update the next recurrence date
        maintenance.calculateNextRecurrenceDate();
        await this.maintenanceRepository.save(maintenance);
      } catch (error) {
        console.error(`Error creating recurring maintenance for ID ${maintenance.id}:`, error);
      }
    }
  }

  // Activity Log methods
  async createActivityLog(
    workspaceId: number,
    userId: number,
    type: ActivityType,
    description: string,
    entityName: string,
    entityId?: number
  ): Promise<void> {
    try {
      const workspace = await this.workspaceRepository.findOneBy({ id: workspaceId });
      const user = await this.userRepository.findOneBy({ id: userId });

      if (workspace && user) {
        const activityLog = this.activityLogRepository.create({
          type,
          description,
          entityName,
          entityId,
          workspace,
          user
        });

        await this.activityLogRepository.save(activityLog);
      }
    } catch (error) {
      console.error('Error creating activity log:', error);
    }
  }

  async getRecentActivities(workspaceId: number, limit: number = 10): Promise<ActivityLogDto[]> {
    const activities = await this.activityLogRepository.find({
      where: { workspace: { id: workspaceId } },
      relations: ['user', 'workspace'],
      order: { createdAt: 'DESC' },
      take: limit
    });

    return activities.map(activity => new ActivityLogDto(activity));
  }
}
