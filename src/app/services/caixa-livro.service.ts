import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CaixaLivro } from '../models/caixa-livro.model';
import { Classificacao } from '../models/classificacao.model';

@Injectable({
  providedIn: 'root'
})
export class CaixaLivroService {
  private baseUrl = 'http://localhost:8080/caixaLivros';

  constructor(private httpClient: HttpClient) { }

  getUrlImage(nomeImagem: string): string{
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }

  uploadImage(id: number, nomeImagem: string, imagem: File): Observable<any>{
    const formData: FormData = new FormData();
    formData.append('id', id.toString());
    formData.append('nomeImagem', imagem.name);
    formData.append('imagem', imagem, imagem.name);

    return this.httpClient.patch<CaixaLivro>(`${this.baseUrl}/image/upload`, formData);
  }

  findClassificacoes(): Observable<Classificacao[]>{
    return this.httpClient.get<Classificacao[]>(`${this.baseUrl}/classificacoes`);
  }

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

  findByAutor(autor: string, page?: number, pageSize?: number): Observable<CaixaLivro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
    return this.httpClient.get<CaixaLivro[]>(`${this.baseUrl}/search/autor/${autor}`, { params });
  }

  findByGenero(genero: string, page?: number, pageSize?: number): Observable<CaixaLivro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      };
    }
    return this.httpClient.get<CaixaLivro[]>(`${this.baseUrl}/search/genero/${genero}`, { params });
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countByNome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/nome/${nome}`);
  }

  countByAutor(autor: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/autor/${autor}`);
  }

  countByGenero(genero: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/genero/${genero}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<CaixaLivro[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<CaixaLivro[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  findById(id: string): Observable<CaixaLivro>{
    return this.httpClient.get<CaixaLivro>(`${this.baseUrl}/${id}`);
  }

  insert(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEmEstoque: caixaLivro.quantidadeEmEstoque,
      fornecedor: caixaLivro.fornecedor?.id,
      preco: caixaLivro.preco,
      editora: caixaLivro.editora?.id,
      generos: caixaLivro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: caixaLivro.autores.filter(autor => autor?.id).map(autor => autor.id),
      idClassificacao: caixaLivro.classificacao.id
    };
    return this.httpClient.post<CaixaLivro>(this.baseUrl, data);
  }

  update(caixaLivro: CaixaLivro): Observable<CaixaLivro>{
    const data = {
      nome: caixaLivro.nome,
      descricao: caixaLivro.descricao,
      quantidadeEmEstoque: caixaLivro.quantidadeEmEstoque,
      fornecedor: caixaLivro.fornecedor?.id,
      preco: caixaLivro.preco,
      editora: caixaLivro.editora?.id,
      generos: caixaLivro.generos.filter(genero => genero?.id).map(genero => genero.id),
      autores: caixaLivro.autores.filter(autor => autor?.id).map(autor => autor.id),
      idClassificacao: caixaLivro.classificacao.id
    };
    return this.httpClient.put<CaixaLivro>(`${this.baseUrl}/${caixaLivro.id}`, data);
  }

  delete(caixaLivro: CaixaLivro): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${caixaLivro.id}`);
  }
}
