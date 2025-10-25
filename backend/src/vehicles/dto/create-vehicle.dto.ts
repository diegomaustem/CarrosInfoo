import { IsString, IsInt, IsOptional, Min, Max, Length } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @Length(7, 7)
  placa: string;

  @IsString()
  @Length(17, 17)
  chassi: string;

  @IsString()
  @Length(11, 11)
  renavam: string;

  @IsString()
  @IsOptional()
  modelo?: string;

  @IsString()
  marca: string;

  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  ano: number;
}
