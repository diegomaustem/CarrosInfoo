import { ApiProperty } from '@nestjs/swagger';
export class Veiculo {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID único do veículo',
  })
  id: string;

  @ApiProperty({ example: 'ABC1D23', description: 'Placa do veículo' })
  placa: string;

  @ApiProperty({
    example: '9BWZZZ377VT004251',
    description: 'Chassi do veículo',
  })
  chassi: string;

  @ApiProperty({ example: '12345678901', description: 'Renavam do veículo' })
  renavam: string;

  @ApiProperty({
    example: 'Gol',
    description: 'Modelo do veículo',
    required: false,
  })
  modelo?: string;

  @ApiProperty({ example: 'Volkswagen', description: 'Marca do veículo' })
  marca: string;

  @ApiProperty({ example: 2023, description: 'Ano do veículo' })
  ano: number;

  @ApiProperty({
    example: '2025-10-25T19:30:00.000Z',
    description: 'Data de criação',
  })
  criadoEm: Date;

  @ApiProperty({
    example: '2025-10-25T19:30:00.000Z',
    description: 'Data da última atualização',
  })
  atualizadoEm: Date;
}
