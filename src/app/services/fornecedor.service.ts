import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model'; // Importa o modelo de Fornecedor

@Injectable({
  providedIn: 'root',
})
export class FornecedorService {
  private baseUrl = 'http://localhost:8080/fornecedores'; // URL base da API de Fornecedores

  constructor(private httpClient: HttpClient) {}

  // Método para buscar todos os fornecedores
  findAll(): Observable<Fornecedor[]> {
    return this.httpClient.get<Fornecedor[]>(this.baseUrl);
  }

  // Método para buscar um fornecedor pelo ID
  findById(id: string): Observable<Fornecedor> {
    return this.httpClient.get<Fornecedor>(`${this.baseUrl}/${id}`);
  }

  // Método para inserir um novo fornecedor
  insert(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      inscricaoEstadual: fornecedor.inscricaoEstadual,
      email: fornecedor.email,
      endereco: fornecedor.endereco,
      cep: fornecedor.cep,
      estado: fornecedor.estado,
      cidade: fornecedor.cidade,
      quantLivrosFornecido: fornecedor.quantLivrosFornecido,
      telefone: {
        codigoArea: fornecedor.telefone.codigoArea,
        numero: fornecedor.telefone.numero,
      },
    };
    return this.httpClient.post<Fornecedor>(this.baseUrl, data);
  }

  // Método para atualizar um fornecedor existente
  update(fornecedor: Fornecedor): Observable<Fornecedor> {
    const data = {
      nome: fornecedor.nome,
      cnpj: fornecedor.cnpj,
      inscricaoEstadual: fornecedor.inscricaoEstadual,
      email: fornecedor.email,
      endereco: fornecedor.endereco,
      cep: fornecedor.cep,
      estado: fornecedor.estado,
      cidade: fornecedor.cidade,
      quantLivrosFornecido: fornecedor.quantLivrosFornecido,
      telefone: {
        codigoArea: fornecedor.telefone.codigoArea,
        numero: fornecedor.telefone.numero,
      },
    };
    return this.httpClient.put<Fornecedor>(`${this.baseUrl}/${fornecedor.id}`, data);
  }

  // Método para deletar um fornecedor
  delete(fornecedor: Fornecedor): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${fornecedor.id}`);
  }
}