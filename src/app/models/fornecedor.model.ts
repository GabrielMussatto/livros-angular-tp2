import { Telefone } from './telefone.model';

export class Fornecedor {
  id!: number;
  nome!: string;
  cnpj!: string;
  inscricaoEstadual!: string;
  email!: string;
  telefone!: Telefone;
  endereco!: string;
  cep!: string;
  estado!: string;
  cidade!: string;
  quantLivrosFornecido!: number;
}