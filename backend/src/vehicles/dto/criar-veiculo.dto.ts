import { IsString, IsInt, IsOptional, Min, Max, Length } from 'class-validator';

export class CriarVeiculoDto {
  @IsString({ message: 'Placa deve ser um texto.' })
  @Length(7, 7, { message: 'Placa deve ter exatamente 7 caracteres.' })
  placa: string;

  @IsString({ message: 'Chassi deve ser um texto.' })
  @Length(17, 17, { message: 'Chassi deve ter exatamente 17 caracteres.' })
  chassi: string;

  @IsString({ message: 'Renavam deve ser um texto.' })
  @Length(11, 11, { message: 'Renavam deve ter exatamente 11 caracteres.' })
  renavam: string;

  @IsString({ message: 'Modelo deve ser um texto.' })
  @IsOptional()
  modelo?: string;

  @IsString({ message: 'Marca deve ser um texto.' })
  marca: string;

  @IsInt({ message: 'Ano deve ser um número inteiro.' })
  @Min(1900, { message: 'Ano deve ser a partir de 1900.' })
  @Max(new Date().getFullYear() + 1, { message: 'Ano não pode ser no futuro.' })
  ano: number;
}
