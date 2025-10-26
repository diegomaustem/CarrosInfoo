import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VehiclesController } from '../vehicles.controller';
import { VehiclesService } from '../vehicles.service';

const mockService = {
  listarTodos: jest.fn(),
  listarPorId: jest.fn(),
  criar: jest.fn(),
  atualizar: jest.fn(),
  deletar: jest.fn(),
};

describe('VehiclesController - Prioridades Altas', () => {
  let controller: VehiclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehiclesController],
      providers: [{ provide: VehiclesService, useValue: mockService }],
    }).compile();

    controller = module.get<VehiclesController>(VehiclesController);
    jest.clearAllMocks();
  });

  // ALTA-FORMATAÇÃO DE RESPOSTA :::
  describe('Formatação de Resposta', () => {
    it('deve retornar formato padrão no POST', async () => {
      // Arrange
      const dadosEntrada = {
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
      };

      const veiculoCriado = { id: '1', ...dadosEntrada };
      mockService.criar.mockResolvedValue(veiculoCriado);

      // Act
      const resultado = await controller.criar(dadosEntrada);

      // Assert
      expect(resultado).toEqual({
        mensagem: 'Veículo criado com sucesso.',
        dados: veiculoCriado,
      });
    });

    it('deve retornar array puro no GET', async () => {
      // Arrange
      const veiculos = [{ id: '1', placa: 'ABC1234' }];
      mockService.listarTodos.mockResolvedValue(veiculos);

      // Act
      const resultado = await controller.listarTodos();

      // Assert
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado).toEqual(veiculos);
    });

    it('deve retornar mensagem de sucesso no DELETE', async () => {
      // Arrange
      mockService.deletar.mockResolvedValue(undefined);

      // Act
      const resultado = await controller.deletar('1');

      // Assert
      expect(resultado).toEqual({
        mensagem: 'Veículo excluído com sucesso.',
      });
    });
  });

  // ALTA-PROPAGAÇÃO DE ERROS :::
  describe('Propagação de Erros', () => {
    it('deve propagar NotFoundException do service', async () => {
      // Arrange
      const notFoundError = new NotFoundException('Veículo não encontrado');
      mockService.listarPorId.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(controller.listarPorId('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
