import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CriarVeiculoDto } from './dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from './dto/atualizar-veiculo.dto';
import { Veiculo } from './entities/veiculo.entity';

@Controller('veiculos')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  async listarTodos(): Promise<Veiculo[]> {
    return this.vehiclesService.listarTodos();
  }

  @Get(':id')
  async listarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Veiculo> {
    return this.vehiclesService.listarPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async criar(
    @Body() veiculo: CriarVeiculoDto,
  ): Promise<{ mensagem: string; dados: Veiculo }> {
    const veiculoCriado = await this.vehiclesService.criar(veiculo);

    return {
      mensagem: 'Veículo criado com sucesso.',
      dados: veiculoCriado,
    };
  }

  @Patch(':id')
  async atualizar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() veiculo: AtualizarVeiculoDto,
  ): Promise<{ mensagem: string; dados: Veiculo }> {
    const veiculoAtualizado = await this.vehiclesService.atualizar(id, veiculo);

    return {
      mensagem: 'Veículo atualizado com sucesso.',
      dados: veiculoAtualizado,
    };
  }

  @Delete(':id')
  async deletar(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensagem: string }> {
    await this.vehiclesService.deletar(id);

    return { mensagem: 'Veículo excluído com sucesso.' };
  }
}
