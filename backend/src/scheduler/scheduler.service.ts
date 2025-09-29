import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WorkspaceService } from '../workspaces/workspace.service';

@Injectable()
export class SchedulerService {
  constructor(private workspaceService: WorkspaceService) {}

  @Cron('0 6 * * *')
  async handleRecurringMaintenances() {
    console.log('Checking for recurring maintenances...');
    try {
      await this.workspaceService.checkAndCreateRecurringMaintenances();
      console.log('Recurring maintenances check completed successfully');
    } catch (error) {
      console.error('Error checking recurring maintenances:', error);
    }
  }

  @Cron('0 1 * * *')
  async handleOverdueMaintenances() {
    console.log('Checking for overdue maintenances...');
    try {
      await this.workspaceService.updateOverdueMaintenances();
      console.log('Overdue maintenances update completed successfully');
    } catch (error) {
      console.error('Error updating overdue maintenances:', error);
    }
  }
}