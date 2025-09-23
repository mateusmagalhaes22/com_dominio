import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CondominiumDto {
    
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  workspaceId: number;

  @IsNumber()
  @IsNotEmpty()
  units: number;

  @IsNumber()
  @IsNotEmpty()
  maintenanceAmount: number;
}