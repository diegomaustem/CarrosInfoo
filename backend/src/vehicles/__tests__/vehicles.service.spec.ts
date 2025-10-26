import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { VehiclesService } from '../vehicles.service';
import { VehiclesRepository } from '../vehicles.repository';
import { CriarVeiculoDto } from '../dto/criar-veiculo.dto';
import { AtualizarVeiculoDto } from '../dto/atualizar-veiculo.dto';

const mockRepository = {
  listarPorId: jest.fn(),
  listarPorPlaca: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  deletar: jest.fn(),
};

describe('VehiclesService - Prioridades Altas', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: VehiclesRepository, useValue: mockRepository },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    jest.clearAllMocks();
  });

  // ALTA-VALIDAÇÃO DE PLACA ÚNICA :::
  describe('Validação de Placa Única', () => {
    it('deve impedir criação com placa duplicada', async () => {
      // Arrange
      const dadosVeiculo: CriarVeiculoDto = {
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
      };

      const veiculoExistente = { id: '2', placa: 'ABC1234' };
      mockRepository.listarPorPlaca.mockResolvedValue(veiculoExistente);

      // Act & Assert
      await expect(service.criar(dadosVeiculo)).rejects.toThrow(
        ConflictException,
      );

      expect(mockRepository.criar).not.toHaveBeenCalled();
    });

    it('deve impedir atualização para placa existente', async () => {
      // Arrange
      const veiculoAtual = { id: '1', placa: 'XYZ5678' };
      const dadosAtualizacao: AtualizarVeiculoDto = { placa: 'ABC1234' };

      const veiculoConflitante = { id: '2', placa: 'ABC1234' };

      mockRepository.listarPorId.mockResolvedValue(veiculoAtual);
      mockRepository.listarPorPlaca.mockResolvedValue(veiculoConflitante);

      // Act & Assert
      await expect(service.atualizar('1', dadosAtualizacao)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve permitir atualização para mesma placa do próprio veículo', async () => {
      // Arrange
      const veiculoAtual = { id: '1', placa: 'ABC1234' };
      const dadosAtualizacao: AtualizarVeiculoDto = { placa: 'ABC1234' };

      mockRepository.listarPorId.mockResolvedValue(veiculoAtual);
      mockRepository.listarPorPlaca.mockResolvedValue(veiculoAtual);
      mockRepository.atualizar.mockResolvedValue({
        ...veiculoAtual,
        ...dadosAtualizacao,
      });

      // Act & Assert
      await expect(
        service.atualizar('1', dadosAtualizacao),
      ).resolves.not.toThrow();
    });
  });

  // ALTA-NORMALIZAÇÃO DE DADOS :::
  describe('Normalização de Dados', () => {
    it('deve converter placa e chassi para uppercase na criação', async () => {
      // Arrange
      const dadosVeiculo: CriarVeiculoDto = {
        placa: 'abc1234',
        chassi: '9bwzzz377vt004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
      };

      mockRepository.listarPorPlaca.mockResolvedValue(null);
      mockRepository.criar.mockResolvedValue({ id: '1', ...dadosVeiculo });

      // Act
      await service.criar(dadosVeiculo);

      // Assert
      expect(mockRepository.criar).toHaveBeenCalledWith({
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
      });
    });

    it('deve converter placa para uppercase na atualização', async () => {
      // Arrange
      const veiculoAtual = { id: '1', placa: 'XYZ5678' };
      const dadosAtualizacao: AtualizarVeiculoDto = { placa: 'nova123' };

      mockRepository.listarPorId.mockResolvedValue(veiculoAtual);
      mockRepository.listarPorPlaca.mockResolvedValue(null);
      mockRepository.atualizar.mockResolvedValue({
        ...veiculoAtual,
        placa: 'NOVA123',
      });

      // Act
      await service.atualizar('1', dadosAtualizacao);

      // Assert
      expect(mockRepository.atualizar).toHaveBeenCalledWith('1', {
        placa: 'NOVA123',
      });
    });
  });

  // ALTA: VALIDA EXISTENCIA :::
  describe('Validação de Existência', () => {
    it('deve verificar existência antes de atualizar', async () => {
      // Arrange
      mockRepository.listarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.atualizar('999', { modelo: 'Novo' }),
      ).rejects.toThrow(NotFoundException);

      expect(mockRepository.atualizar).not.toHaveBeenCalled();
    });

    it('deve verificar existência antes de deletar', async () => {
      // Arrange
      mockRepository.listarPorId.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletar('999')).rejects.toThrow(NotFoundException);

      expect(mockRepository.deletar).not.toHaveBeenCalled();
    });
  });

  // MÉDIA: CAMPOS OPCIONAIS :::
  describe('Campos Opcionais', () => {
    it('deve criar veículo sem modelo', async () => {
      // Arrange
      const dadosVeiculo: CriarVeiculoDto = {
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
        // modelo omitido propositalmente
      };

      mockRepository.listarPorPlaca.mockResolvedValue(null);
      mockRepository.criar.mockResolvedValue({ id: '1', ...dadosVeiculo });

      // Act & Assert
      await expect(service.criar(dadosVeiculo)).resolves.not.toThrow();
    });

    it('deve atualizar apenas campos fornecidos', async () => {
      // Arrange
      const veiculoAtual = {
        id: '1',
        placa: 'ABC1234',
        modelo: 'Modelo Antigo',
        marca: 'Marca Antiga',
        ano: 2020,
      };

      const dadosParciais: AtualizarVeiculoDto = { modelo: 'Novo Modelo' };

      mockRepository.listarPorId.mockResolvedValue(veiculoAtual);
      mockRepository.listarPorPlaca.mockResolvedValue(null);
      mockRepository.atualizar.mockResolvedValue({
        ...veiculoAtual,
        ...dadosParciais,
      });

      // Act
      await service.atualizar('1', dadosParciais);

      // Assert
      expect(mockRepository.atualizar).toHaveBeenCalledWith('1', {
        modelo: 'Novo Modelo',
      });
    });
  });
});
