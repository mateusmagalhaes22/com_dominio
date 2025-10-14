import { ActivityType } from './activity-log.entity';

export class ActivityLogDto {
  id: number;
  type: ActivityType;
  description: string;
  entityName: string;
  entityId?: number;
  createdAt: Date;
  userId: number;
  workspaceId: number;

  constructor(activityLog: any) {
    this.id = activityLog.id;
    this.type = activityLog.type;
    this.description = activityLog.description;
    this.entityName = activityLog.entityName;
    this.entityId = activityLog.entityId;
    this.createdAt = activityLog.createdAt;
    this.userId = activityLog.user?.id;
    this.workspaceId = activityLog.workspace?.id;
  }
}