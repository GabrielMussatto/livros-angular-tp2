import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { ItemFavorito } from '../models/item-favorito';
import { Sugestao } from '../models/sugestao.model';
import { Sexo } from '../models/sexo.model';
import { Pedido } from '../models/pedido';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/clientes';
  private urlAPI = 'http://localhost:8080/pedidos';

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

  findByNome(nome: string, page: number, pageSize: number): Observable<Cliente[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/search/nome/${nome}`, { headers, params });
  }

  findByCpf(cpf: string, page: number, pageSize: number): Observable<Cliente[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/search/cpf/${cpf}`, { headers, params });
  }

  getPedidosCliente(): Observable<Pedido[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Pedido[]>(`${this.urlAPI}/meus-pedidos`, { headers });
  }

  
  findByEstado(estado: string, page: number, pageSize: number): Observable<Cliente[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Cliente[]>(`${this.baseUrl}/search/estado/${estado}`, { headers, params });
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
  insert(cliente: Cliente): Observable<Cliente> {
    const data = {
      cep: cliente.cep,
      endereco: cliente.endereco,
      estado: cliente.estado,
      sigla: cliente.sigla,
      cidade: cliente.cidade,
      nome: cliente.usuario.nome,
      username: cliente.usuario.username,
      senha: cliente.usuario.senha,
      dataNascimento: cliente.usuario.dataNascimento,
      email: cliente.usuario.email,
      cpf: cliente.usuario.cpf,
      telefone: {
        codigoArea: cliente.usuario.telefone.codigoArea,
        numero: cliente.usuario.telefone.numero,
      },
      idSexo: cliente.usuario.idSexo.id
    }
    return this.httpClient.post<Cliente>(this.baseUrl, data);
  }

  // Atualizar um cliente
  update(cliente: Cliente): Observable<Cliente> {
    const data = {
      cep: cliente.cep,
      endereco: cliente.endereco,
      estado: cliente.estado,
      sigla: cliente.sigla,
      cidade: cliente.cidade,
      nome: cliente.usuario.nome,
      username: cliente.usuario.username,
      senha: cliente.usuario.senha,
      dataNascimento: cliente.usuario.dataNascimento,
      email: cliente.usuario.email,
      cpf: cliente.usuario.cpf,
      telefone: {
        codigoArea: cliente.usuario.telefone.codigoArea,
        numero: cliente.usuario.telefone.numero,
      },
      idSexo: cliente.usuario.idSexo.id
    }
    return this.httpClient.put<Cliente>(`${this.baseUrl}/${cliente.id}`, data);
  }

  // Buscar cliente por ID
  findById(id: string): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  findAll(page: number, pageSize: number): Observable<Cliente[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Cliente[]>(this.baseUrl, { headers, params });
  }

  // Excluir um cliente
  delete(cliente: Cliente): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${cliente.id}`);
  }

  countByNome(nome: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/nome/${nome}`, { headers });
  }

  countByCpf(cpf: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/cpf/${cpf}`, { headers });
  }

  countByEstado(estado: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/estado/${estado}`, { headers });
  }

  // Método para contar o total de clientes
  count(): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count`, { headers });
  }

  findSexos(): Observable<Sexo[]> {
    return this.httpClient.get<Sexo[]>(`${this.baseUrl}/sexos`);
  }

  alterarUsername(data: { usernameNovo: string; senha: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.patch(`${this.baseUrl}/search/alterar-username`, data, { headers });
  }

  alterarSenha(data: { senhaAntiga: string; novaSenha: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.httpClient.patch(`${this.baseUrl}/search/alterar-senha`, data, { headers });
  }

  meuPerfil(idCliente: number): Observable<Cliente> {
    const headers = this.getHeaders();
    return this.httpClient.get<Cliente>(`${this.baseUrl}/search/meu-perfil`, { headers });
  }
}