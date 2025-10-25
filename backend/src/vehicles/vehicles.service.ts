import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';

@Injectable()
export class VehiclesService {
  private readonly logger = new Logger(VehiclesService.name);

  constructor(private readonly repository: VehiclesRepository) {}

  async listarTodos(): Promise<Veiculo[]> {
    return this.repository.listarTodos();
  }

  async listarPorId(id: string): Promise<Veiculo> {
    try {
      const veiculo = await this.repository.listarPorId(id);
      if (!veiculo) {
        throw new NotFoundException(`Veículo com ID ${id} não encontrado.`);
      }
      return veiculo;
    } catch (error) {
      this.logger.error(`Erro ao buscar veículo ${id}:`, error);
      throw error;
    }
  }

  async criar(veiculo: CriarVeiculoDto): Promise<Veiculo> {
    try {
      await this.validarPlacaUnica(veiculo);
      const dadosVeiculo = {
        ...veiculo,
        placa: veiculo.placa.toUpperCase(),
        chassi: veiculo.chassi.toUpperCase(),
      };

      return this.repository.criar(dadosVeiculo);
    } catch (error) {
      this.logger.error('Erro ao criar veículo:', error);
      throw error;
    }
  }

  async atualizar(id: string, veiculo: AtualizarVeiculoDto): Promise<Veiculo> {
    try {
      await this.listarPorId(id);

      if (veiculo.placa || veiculo.chassi) {
        await this.validarPlacaUnica(veiculo, id);
      }
      const dadosVeiculo = this.formataVeiculo(veiculo);
      return this.repository.atualizar(id, dadosVeiculo);
    } catch (error) {
      this.logger.error(`Erro ao atualizar veículo ${id}:`, error);
      throw error;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.listarPorId(id);
      await this.repository.deletar(id);
    } catch (error) {
      this.logger.error(`Erro ao deletar veículo ${id}:`, error);
      throw error;
    }
  }

  private async validarPlacaUnica(
    dto: CriarVeiculoDto | AtualizarVeiculoDto,
    id?: string,
  ): Promise<void> {
    if (dto.placa) {
      const existeVeiculo = await this.repository.listarPorPlaca(dto.placa);
      if (existeVeiculo && existeVeiculo.id !== id) {
        throw new ConflictException('Já existe um veículo com esta placa.');
      }
    }
  }

  private formataVeiculo(
    veiculo: AtualizarVeiculoDto,
  ): Partial<CriarVeiculoDto> {
    const data: any = { ...veiculo };

    if (veiculo.placa) {
      data.placa = veiculo.placa.toUpperCase();
    }
    if (veiculo.chassi) {
      data.chassi = veiculo.chassi.toUpperCase();
    }

    return data;
  }
}
