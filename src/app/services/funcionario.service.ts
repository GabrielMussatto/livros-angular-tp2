import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sugestao } from '../models/sugestao.model';
import { Funcionario } from '../models/funcionario.model';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  private baseUrl = 'http://localhost:8080/funcionarios';

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

  listarSugestoes(): Observable<Sugestao[]> {
    const headers = this.getHeaders();
    return this.httpClient.get<Sugestao[]>(
      `${this.baseUrl}/sugestoes/listarSugestoes`,
      { headers }
    );
  }

  findAll(page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(this.baseUrl, { headers, params });
  }

  findById(id: string): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string, page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      nome,
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(`${this.baseUrl}/search/nome`, { headers, params });
  }

  countByNome(nome: string): Observable<number> {
    const headers = this.getHeaders();
    const params = { nome };
    return this.httpClient.get<number>(`${this.baseUrl}/count/nome`, { headers, params });
  }

  // Método para contar o total de clientes
  count(): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count`, { headers });
  }

  insert(funcionario: Funcionario): Observable<Funcionario> {
    const data = {
      salario: funcionario.salario,
      cargo: funcionario.cargo,
      nome: funcionario.usuario.nome,
      username: funcionario.usuario.username,
      senha: funcionario.usuario.senha,
      dataNascimento: funcionario.usuario.dataNascimento,
      email: funcionario.usuario.email,
      cpf: funcionario.usuario.cpf,
      telefone: funcionario.usuario.telefone,
      idSexo: funcionario.usuario.idSexo.id
    }
    return this.httpClient.post<Funcionario>(this.baseUrl, data);
  }

  // Atualizar um cliente
  update(funcionario: Funcionario): Observable<void> {
    const data = {
      salario: funcionario.salario,
      cargo: funcionario.cargo,
      nome: funcionario.usuario.nome,
      username: funcionario.usuario.username,
      senha: funcionario.usuario.senha,
      dataNascimento: funcionario.usuario.dataNascimento,
      email: funcionario.usuario.email,
      cpf: funcionario.usuario.cpf,
      telefone: funcionario.usuario.telefone,
      idSexo: funcionario.usuario.idSexo.id
    }
    return this.httpClient.put<void>(`${this.baseUrl}/${funcionario.id}`, data);
  }

  delete(funcionario: Funcionario): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${funcionario.id}`);
  }
}
