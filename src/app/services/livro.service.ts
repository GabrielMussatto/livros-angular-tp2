import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/livros';

  constructor(private httpClient: HttpClient) { }

  getUrlImage(nomeImagem: string): string{
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  findAll(page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};

    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Livro[]>(this.baseUrl, {params});
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByTitulo(titulo: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/titulo/${titulo}`);
  }

  countByAutor(autor: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/autor/${autor}`);
  }

  countByGenero(genero: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/genero/${genero}`);
  }

  findByNome(titulo: string, page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/titulo/${titulo}`, { params });
  }

  findByAutor(autor: string, page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/autor/${autor}`, { params });
  }
  
  findByGenero(genero: string, page?: number, pageSize?: number): Observable<Livro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/genero/${genero}`, { params });
  }

  findById(id: string): Observable<Livro>{
    return this.httpClient.get<Livro>(`${this.baseUrl}/${id}`);
  }

  insert(livro: Livro): Observable<Livro>{
    const data = {
      titulo: livro.titulo,
      descricao: livro.descricao,
      quantidadeEstoque: livro.quantidadeEstoque,
      isbn: livro.isbn,
      preco: livro.preco,
      classificacao: livro.classificacao,
      fornecedor: livro.fornecedor.id,
      editora: livro.editora.id,
      generos: livro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: livro.autores.filter(autor => autor?.id).map(autor => autor.id),
      datalancamento: livro.datalancamento
    };
    return this.httpClient.post<Livro>(this.baseUrl, data);
  }

  update(livro: Livro): Observable<Livro>{
    const data = {
      titulo: livro.titulo,
      descricao: livro.descricao,
      quantidadeEstoque: livro.quantidadeEstoque,
      isbn: livro.isbn,
      preco: livro.preco,
      classificacao: livro.classificacao,
      fornecedor: livro.fornecedor.id,
      editora: livro.editora.id,
      generos: livro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: livro.autores.filter(autor => autor?.id).map(autor => autor.id),
      datalancamento: livro.datalancamento
    };
    return this.httpClient.put<Livro>(`${this.baseUrl}/${livro.id}`, data);
  }

  delete(livro: Livro): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${livro.id}`);
  }

}
