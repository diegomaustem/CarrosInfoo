import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';
import { VeiculoPrisma } from './types/veiculo-prisma.type';

@Injectable()
export class VehiclesRepository {
  private readonly logger = new Logger(VehiclesRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async listarTodos(): Promise<Veiculo[]> {
    try {
      const veiculos = await this.prisma.veiculo.findMany({
        orderBy: { criadoEm: 'desc' },
      });
      return veiculos.map(this.formataVeiculo);
    } catch (error) {
      this.logger.error('Erro ao listar veículos:', error);
      throw error;
    }
  }

  async listarPorId(id: string): Promise<Veiculo | null> {
    try {
      const veiculo = await this.prisma.veiculo.findUnique({ where: { id } });
      return veiculo ? this.formataVeiculo(veiculo) : null;
    } catch (error) {
      this.logger.error(`Erro ao buscar veículo ${id}:`, error);
      throw error;
    }
  }

  async listarPorPlaca(placa: string): Promise<Veiculo | null> {
    try {
      const vehicle = await this.prisma.veiculo.findUnique({
        where: { placa: placa.toUpperCase() },
      });
      return vehicle ? this.formataVeiculo(vehicle) : null;
    } catch (error) {
      this.logger.error(`Erro ao buscar veículo por placa ${placa}:`, error);
      throw error;
    }
  }

  async criar(data: CriarVeiculoDto): Promise<Veiculo> {
    try {
      const veiculo = await this.prisma.veiculo.create({ data });
      return this.formataVeiculo(veiculo);
    } catch (error) {
      this.logger.error('Erro ao criar veículo:', error);
      throw error;
    }
  }

  async atualizar(id: string, data: AtualizarVeiculoDto): Promise<Veiculo> {
    try {
      const veiculo = await this.prisma.veiculo.update({
        where: { id },
        data,
      });
      return this.formataVeiculo(veiculo);
    } catch (error) {
      this.logger.error(`Erro ao atualizar veículo ${id}:`, error);
      throw error;
    }
  }

  async deletar(id: string): Promise<void> {
    try {
      await this.prisma.veiculo.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`Erro ao deletar veículo ${id}:`, error);
      throw error;
    }
  }

  private formataVeiculo = (veiculo: VeiculoPrisma): Veiculo => {
    return {
      id: veiculo.id,
      placa: veiculo.placa,
      chassi: veiculo.chassi,
      renavam: veiculo.renavam,
      modelo: veiculo.modelo ?? undefined,
      marca: veiculo.marca,
      ano: veiculo.ano,
      criadoEm: veiculo.criadoEm,
      atualizadoEm: veiculo.atualizadoEm,
    };
  };
}
