import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaixaLivro } from '../models/caixa-livro.model';

@Injectable({
  providedIn: 'root'
})
export class CaixaLivroService {
  private baseUrl = 'http://localhost:8080/caixaLivros';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<CaixaLivro[]>{
    return this.httpClient.get<CaixaLivro[]>(this.baseUrl);
  }

  findById(id: string): Observable<CaixaLivro>{
    return this.httpClient.get<CaixaLivro>(`${this.baseUrl}/${id}`);
  }

  insert(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEstoque: caixaLivro.quantidadeEstoque,
      fornecedor: caixaLivro.fornecedor.id,
      editora: caixaLivro.editora.id,
      generos: caixaLivro.generos.map(genero => genero.id), // Mapeia os IDs dos gêneros
      autores: caixaLivro.autores.map(autor => autor.id),   // Mapeia os IDs dos autores
      classificacao: caixaLivro.classificacao
    };

    return this.httpClient.post<CaixaLivro>(this.baseUrl, data);
  }

  update(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEstoque: caixaLivro.quantidadeEstoque,
      fornecedor: caixaLivro.fornecedor.id,
      editora: caixaLivro.editora.id,
      generos: caixaLivro.generos.map(genero => genero.id), // Mapeia os IDs dos gêneros
      autores: caixaLivro.autores.map(autor => autor.id),   // Mapeia os IDs dos autores
      classificacao: caixaLivro.classificacao
    };
    return this.httpClient.put<CaixaLivro>(`${this.baseUrl}`, data);
  }

  delete(caixaLivro: CaixaLivro): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${caixaLivro.id}`);
  }
}
