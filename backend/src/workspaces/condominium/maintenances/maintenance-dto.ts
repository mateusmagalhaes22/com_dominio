import { IsDate, IsString, IsEnum, IsOptional } from 'class-validator';
import { MaintenanceStatus } from './maintenance-status.enum';

export class MaintenanceDto {

  @IsString()
  name: String;

  @IsString()
  description: String;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;
}
