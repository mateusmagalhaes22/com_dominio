import { IsDate, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { MaintenanceStatus } from './maintenance-status.enum';
import { RecurringPeriod } from './recurring-period.enum';

export class MaintenanceDto {

  @IsString()
  name: String;

  @IsString()
  description: String;

  @IsOptional()
  @IsDate()
  endDate?: Date;

  @IsEnum(MaintenanceStatus)
  @IsOptional()
  status?: MaintenanceStatus;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @IsEnum(RecurringPeriod)
  @IsOptional()
  recurringPeriod?: RecurringPeriod;
}
