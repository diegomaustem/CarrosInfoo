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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('veiculos')
@Controller('veiculos')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os veículos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de veículos retornada com sucesso',
  })
  async listarTodos(): Promise<Veiculo[]> {
    return this.vehiclesService.listarTodos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar veículo por ID' })
  @ApiParam({ name: 'id', description: 'UUID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo encontrado' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async listarPorId(@Param('id', ParseUUIDPipe) id: string): Promise<Veiculo> {
    return this.vehiclesService.listarPorId(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar um novo veículo' })
  @ApiResponse({ status: 201, description: 'Veículo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Placa já existe' })
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
  @ApiOperation({ summary: 'Atualizar veículo' })
  @ApiParam({ name: 'id', description: 'UUID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
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
  @ApiOperation({ summary: 'Excluir veículo' })
  @ApiParam({ name: 'id', description: 'UUID do veículo' })
  @ApiResponse({ status: 200, description: 'Veículo excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Veículo não encontrado' })
  async deletar(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ mensagem: string }> {
    await this.vehiclesService.deletar(id);

    return { mensagem: 'Veículo excluído com sucesso.' };
  }
}
