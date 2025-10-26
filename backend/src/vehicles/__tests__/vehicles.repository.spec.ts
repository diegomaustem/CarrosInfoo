import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../database/prisma.service';
import { VehiclesRepository } from '../vehicles.repository';

const mockPrisma = {
  veiculo: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('VehiclesRepository - Prioridades Altas', () => {
  let repository: VehiclesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<VehiclesRepository>(VehiclesRepository);
    jest.clearAllMocks();
  });

  // ALTA: FORMATAÇÃO DE DADOS :::
  describe('Formatação de Dados', () => {
    it('deve converter alteradoEm para atualizadoEm', async () => {
      // Arrange
      const veiculoPrisma = {
        id: '1',
        placa: 'ABC1234',
        criadoEm: new Date('2025-10-25T19:30:00.000Z'),
        atualizadoEm: new Date('2025-10-25T20:00:00.000Z'),
      };

      mockPrisma.veiculo.findMany.mockResolvedValue([veiculoPrisma]);

      // Act
      const resultado = await repository.listarTodos();

      // Assert
      expect(resultado[0].atualizadoEm).toEqual(
        new Date('2025-10-25T20:00:00.000Z'),
      );
      expect(resultado[0]).not.toHaveProperty('alteradoEm');
    });

    it('deve converter null modelo para undefined', async () => {
      // Arrange
      const veiculoPrisma = {
        id: '1',
        placa: 'ABC1234',
        modelo: null,
        criadoEm: new Date(),
        atualizadoEm: new Date(),
      };

      mockPrisma.veiculo.findUnique.mockResolvedValue(veiculoPrisma);

      // Act
      const resultado = await repository.listarPorId('1');

      // Assert
      expect(resultado).not.toBeNull();
      expect(resultado!.modelo).toBeUndefined();
    });
  });

  // ALTA: BUSCA CASE-INSENSITIVE :::
  describe('Busca por Placa', () => {
    it('deve converter placa para uppercase na busca', async () => {
      // Arrange
      mockPrisma.veiculo.findUnique.mockResolvedValue(null);

      // Act
      await repository.listarPorPlaca('abc1234');

      // Assert
      expect(mockPrisma.veiculo.findUnique).toHaveBeenCalledWith({
        where: { placa: 'ABC1234' },
      });
    });
  });

  // ALTA: OPERAÇÕES CRUD :::
  describe('Operações CRUD', () => {
    it('deve criar veículo com dados corretos', async () => {
      // Arrange
      const dadosCriacao = {
        placa: 'ABC1234',
        chassi: '9BWZZZ377VT004251',
        renavam: '12345678901',
        marca: 'Fiat',
        ano: 2023,
      };

      const veiculoCriado = { id: '1', ...dadosCriacao };
      mockPrisma.veiculo.create.mockResolvedValue(veiculoCriado);

      // Act
      const resultado = await repository.criar(dadosCriacao);

      // Assert
      expect(mockPrisma.veiculo.create).toHaveBeenCalledWith({
        data: dadosCriacao,
      });
      expect(resultado.id).toBe('1');
    });

    it('deve atualizar veículo com ID correto', async () => {
      // Arrange
      const dadosAtualizacao = { modelo: 'Novo Modelo' };
      mockPrisma.veiculo.update.mockResolvedValue({
        id: '1',
        ...dadosAtualizacao,
      });

      // Act
      await repository.atualizar('1', dadosAtualizacao);

      // Assert
      expect(mockPrisma.veiculo.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: dadosAtualizacao,
      });
    });

    it('deve deletar veículo com ID correto', async () => {
      // Arrange
      mockPrisma.veiculo.delete.mockResolvedValue({ id: '1' });

      // Act
      await repository.deletar('1');

      // Assert
      expect(mockPrisma.veiculo.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
