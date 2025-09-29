import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { WorkspacesModule } from '../workspaces/workspaces.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    WorkspacesModule
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}