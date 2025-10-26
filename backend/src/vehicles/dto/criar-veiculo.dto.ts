import { IsString, IsInt, IsOptional, Min, Max, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CriarVeiculoDto {
  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  @IsString({ message: 'Placa deve ser um texto.' })
  @Length(7, 7, { message: 'Placa deve ter exatamente 7 caracteres.' })
  placa: string;

  @ApiProperty({
    example: '9BWZZZ377VT004251',
    description: 'Chassi do veículo',
  })
  @IsString({ message: 'Chassi deve ser um texto.' })
  @Length(17, 17, { message: 'Chassi deve ter exatamente 17 caracteres.' })
  chassi: string;

  @ApiProperty({ example: '12345678901', description: 'Renavam do veículo' })
  @IsString({ message: 'Renavam deve ser um texto.' })
  @Length(11, 11, { message: 'Renavam deve ter exatamente 11 caracteres.' })
  renavam: string;

  @ApiPropertyOptional({ example: 'Gol', description: 'Modelo do veículo' })
  @IsString({ message: 'Modelo deve ser um texto.' })
  @IsOptional()
  modelo?: string;

  @ApiProperty({ example: 'Volkswagen', description: 'Marca do veículo' })
  @IsString({ message: 'Marca deve ser um texto.' })
  marca: string;

  @ApiProperty({ example: 2023, description: 'Ano do veículo' })
  @IsInt({ message: 'Ano deve ser um número inteiro.' })
  @Min(1900, { message: 'Ano deve ser a partir de 1900.' })
  @Max(new Date().getFullYear() + 1, { message: 'Ano não pode ser no futuro.' })
  ano: number;
}
