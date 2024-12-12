import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ItemFavorito } from '../models/item-favorito';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('Usuário não autenticado');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  adicionarItemFavorito(idLivro?: number, idCaixaLivro?: number): Observable<void> {
    const headers = this.getHeaders();
    const params: any = {};
    if (idLivro) params.idLivro = idLivro;
    if (idCaixaLivro) params.idCaixaLivro = idCaixaLivro;

    console.log(params);
    return this.httpClient.patch<void>(`${this.baseUrl}/favoritos/adicionar`, null, {
      headers,
      params,
    });
  }

  removerItemFavorito(id: number): Observable<void> {
    const headers = this.getHeaders();
    return this.httpClient.patch<void>(`${this.baseUrl}/favoritos/remover/${id}`, {}, { headers });
  }

  getListaFavoritos(): Observable<ItemFavorito[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<ItemFavorito[]>(`${this.baseUrl}/favoritos`, { headers });
  }
  
  // Métodos específicos para livros
  adicionarLivroFavorito(idLivro: number): Observable<void> {
    return this.adicionarItemFavorito(idLivro);
  }

  removerLivroFavorito(idLivro: number): Observable<void> {
    return this.removerItemFavorito(idLivro);
  }

  // Métodos específicos para boxes
  adicionarCaixaLivroFavorito(idCaixaLivro: number): Observable<void> {
    return this.adicionarItemFavorito(undefined, idCaixaLivro);
  }

  removerCaixaLivroFavorito(idCaixaLivro: number): Observable<void> {
    return this.removerItemFavorito(idCaixaLivro);
  }
 
  // Criar um cliente
  create(cliente: Cliente): Observable<Cliente> {
    return this.httpClient.post<Cliente>(this.baseUrl, cliente);
  }

  // Atualizar um cliente
  update(id: number, cliente: Cliente): Observable<void> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}`, cliente);
  }

  // Buscar cliente por ID
  findById(id: number): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  // Buscar cliente por CPF
  findByCpf(cpf: string): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/search/cpf/${cpf}`);
  }

  // Listar todos os clientes
  findAll(): Observable<Cliente[]> {
    return this.httpClient.get<Cliente[]>(this.baseUrl);
  }

  // Excluir um cliente
  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}