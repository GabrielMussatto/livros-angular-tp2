import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Livro } from '../models/livro.model';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'httpClient://localhost:8080/clientes';

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  adicionarLivroFavorito(idLivro: number): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigateByUrl('/login');
      return throwError(() => new Error ('O Usuário não está logado'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.patch<void>(`${this.baseUrl}/search/adicionar-livro-favorito/${idLivro}`, {}, {headers});
  }

  removendoLivroFavorito(idLivro: number): Observable<void>{
    const token = localStorage.getItem('token');
    if(!token){
      this.router.navigateByUrl('/login');
      return throwError(() => new Error ('O Usuário não está logado'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.patch<void>(`${this.baseUrl}/search/remover-livro-favorito/${idLivro}`, {}, {headers});
  }

  getLivrosListaFavoritos(): Observable<Livro[]>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    
    return this.httpClient.get<Livro[]>(`${this.baseUrl}/search/livros-favoritos`, {headers});
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
