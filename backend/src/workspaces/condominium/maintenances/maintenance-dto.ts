import { IsDate, IsString } from 'class-validator';

export class MaintenanceDto {

  @IsString()
  name: String;

  @IsString()
  description: String;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}
