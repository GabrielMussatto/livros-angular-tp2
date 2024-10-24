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

  findAll(page?: number, pageSize?: number): Observable<CaixaLivro[]>{
    let params = {};
  
    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    
    return this.httpClient.get<CaixaLivro[]>(this.baseUrl, {params});
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findById(id: string): Observable<CaixaLivro>{
    return this.httpClient.get<CaixaLivro>(`${this.baseUrl}/${id}`);
  }

  insert(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEstoque: caixaLivro.quantidadeEstoque,
      fornecedor: caixaLivro.fornecedor?.id,
      preco: caixaLivro.preco,
      editora: caixaLivro.editora?.id,
      generos: caixaLivro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: caixaLivro.autores.filter(autor => autor?.id).map(autor => autor.id),
      classificacao: caixaLivro.classificacao
    };
    return this.httpClient.post<CaixaLivro>(this.baseUrl, data);
  }

  update(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEstoque: caixaLivro.quantidadeEstoque,
      fornecedor: caixaLivro.fornecedor?.id,
      preco: caixaLivro.preco,
      editora: caixaLivro.editora?.id,
      generos: caixaLivro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: caixaLivro.autores.filter(autor => autor?.id).map(autor => autor.id),
      classificacao: caixaLivro.classificacao
    };
    return this.httpClient.put<CaixaLivro>(`${this.baseUrl}/${caixaLivro.id}`, data);
  }

  delete(caixaLivro: CaixaLivro): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${caixaLivro.id}`);
  }
}
