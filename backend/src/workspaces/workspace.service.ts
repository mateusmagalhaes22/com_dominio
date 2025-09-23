import { Injectable, NotFoundException } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { User } from '../users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Condominium } from 'src/workspaces/condominium/condominium.entity';
import { CondominiumDto } from 'src/workspaces/condominium/condominium-dto';
import { Maintenance } from './condominium/maintenances/maintenance.entity';
import { MaintenanceStatus } from './condominium/maintenances/maintenance-status.enum';

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

  updateCondominium(id: number, condominiumId: number, data: { name: string; cnpj: string; address: string; }) {
    return this.condominiumRepository.update({ id: condominiumId, workspace: { id } }, data).then(() => {
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

    // Handle endDate properly - convert string to Date if needed
    const processedData = { ...data };
    if (processedData.endDate) {
      // Convert string to Date if it's a string
      if (typeof processedData.endDate === 'string') {
        processedData.endDate = new Date(processedData.endDate);
      }
      
      // Check if the resulting Date is valid
      if (isNaN(processedData.endDate.getTime()) || processedData.endDate.toString() === 'Invalid Date') {
        processedData.endDate = undefined;
      }
    }

    const maintenance = this.maintenanceRepository.create({
      ...processedData,
      condominium,
    });

    return this.maintenanceRepository.save(maintenance);
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
    return this.maintenanceRepository.update({ id: maintenanceId, condominium: { id: condominiumId } }, data).then(() => {
      return this.maintenanceRepository.findOne({ where: { id: maintenanceId, condominium: { id: condominiumId } } });
    });
  }

  removeMaintenance(condominiumId: number, maintenanceId: number) {
    return this.maintenanceRepository.delete({ id: maintenanceId, condominium: { id: condominiumId } });
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
}
