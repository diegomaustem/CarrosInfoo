export interface VeiculoPrisma {
  id: string;
  placa: string;
  chassi: string;
  renavam: string;
  modelo: string | null;
  marca: string;
  ano: number;
  criadoEm: Date;
  atualizadoEm: Date;
}
