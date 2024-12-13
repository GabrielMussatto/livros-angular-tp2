import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ItemFavorito } from '../models/item-favorito';
import { Sugestao } from '../models/sugestao.model';

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

  // Adicionar Sugestão
  adicionarSugestao(sugestao: string): Observable<Sugestao> {
    const headers = this.getHeaders();
    const body = { sugestao };
    return this.httpClient.post<Sugestao>(
      `${this.baseUrl}/sugestoes/adicionarSugestao`,
      body,
      { headers }
    );
  }

  // Buscar Minhas Sugestões
  findMinhasSugestoes(): Observable<Sugestao[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Sugestao[]>(
      `${this.baseUrl}/sugestoes/minhasSugestoes`,
      { headers }
    );
  }
 
  // Criar um cliente
  create(cliente: Cliente): Observable<Cliente> {
    const data = {
      cep: cliente.cep,
      endereco: cliente.endereco,
      estado: cliente.estado,
      cidade: cliente.cidade,
      nome: cliente.usuario.nome,
      username: cliente.usuario.username,
      senha: cliente.usuario.senha,
      dataNascimento: cliente.usuario.dataNascimento,
      email: cliente.usuario.email,
      cpf: cliente.usuario.cpf,
      telefone: cliente.usuario.telefone,
      idSexo: cliente.usuario.idSexo.id
    }
    return this.httpClient.post<Cliente>(this.baseUrl, data);
  }

  // Atualizar um cliente
  update(cliente: Cliente): Observable<void> {
    const data = {
      cep: cliente.cep,
      endereco: cliente.endereco,
      estado: cliente.estado,
      cidade: cliente.cidade,
      nome: cliente.usuario.nome,
      username: cliente.usuario.username,
      senha: cliente.usuario.senha,
      dataNascimento: cliente.usuario.dataNascimento,
      email: cliente.usuario.email,
      cpf: cliente.usuario.cpf,
      telefone: cliente.usuario.telefone,
      idSexo: cliente.usuario.idSexo.id
    }
    return this.httpClient.put<void>(`${this.baseUrl}/${cliente.id}`, data);
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
  delete(cliente: Cliente): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${cliente.id}`);
  }
}