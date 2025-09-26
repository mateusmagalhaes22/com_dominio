import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

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

  @IsString()
  @IsOptional()
  phone?: string;
}