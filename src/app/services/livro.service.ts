import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Livro } from '../models/livro.model';
import { Classificacao } from '../models/classificacao.model';
import { Autor } from '../models/autor.model';
import { Genero } from '../models/genero.model';

@Injectable({
  providedIn: 'root'
})
export class LivroService {
  private baseUrl = 'http://localhost:8080/livros';

  constructor(private httpClient: HttpClient) { }

  getUrlImage(nomeImagem: string): string{
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<Livro>(`${this.baseUrl}/image/upload`, formData);
  }

  findClassificacoes(): Observable<Classificacao[]>{
    return this.httpClient.get<Classificacao[]>(`${this.baseUrl}/classificacoes`);
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

  findByTitulo(titulo: string, page?: number, pageSize?: number): Observable<Livro[]> {
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

  findByFilters(
    autores: number[],
    editoras: number[],
    generos: number[],
    page?: number,
    pageSize?: number
  ): Observable<{ livros: Livro[]; autores: number[]; editoras: number[]; generos: number[] }> {
    let params = new HttpParams();
  
    if (autores.length > 0) {
      params = params.set('autores', autores.join(','));
    }
    if (editoras.length > 0) {
      params = params.set('editoras', editoras.join(','));
    }
    if (generos.length > 0) {
      params = params.set('generos', generos.join(','));
    }
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (pageSize !== undefined) {
      params = params.set('pageSize', pageSize.toString());
    }
  
    return this.httpClient.get<{ livros: Livro[]; autores: number[]; editoras: number[]; generos: number[] }>(
      `${this.baseUrl}/search/filters`, 
      { params }
    );
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
      idClassificacao: livro.classificacao.id,
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
      idClassificacao: livro.classificacao.id,
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
