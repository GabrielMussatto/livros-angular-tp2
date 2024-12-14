import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Sugestao } from '../models/sugestao.model';
import { Funcionario } from '../models/funcionario.model';
import { Sexo } from '../models/sexo.model';

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
  
  // Buscar todos os funcionários
  findAll(page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(this.baseUrl, { headers, params });
  }

  // Buscar um funcionário por ID
  findById(id: string): Observable<Funcionario> {
    return this.httpClient.get<Funcionario>(`${this.baseUrl}/${id}`);
  }

  // Buscar funcionário por nome
  findByNome(nome: string, page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(`${this.baseUrl}/search/nome/${nome}`, { headers, params });
  }

  // Buscar funcionário por cargo
  findByCargo(cargo: string, page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(`${this.baseUrl}/search/cargo/${cargo}`, { headers, params });
  }

  // Buscar funcionário por CPF
  findByCpf(cpf: string, page: number, pageSize: number): Observable<Funcionario[]> {
    const headers = this.getHeaders();
    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    return this.httpClient.get<Funcionario[]>(`${this.baseUrl}/search/cpf/${cpf}`, { headers, params });
  }

  // Contar o número total de funcionários
  count(): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count`, { headers });
  }

  // Contar funcionários por nome
  countByNome(nome: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/nome/${nome}`, { headers });
  }

  // Contar funcionários por cargo
  countByCargo(cargo: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/cargo/${cargo}`, { headers });
  }

  // Contar funcionários por CPF
  countByCpf(cpf: string): Observable<number> {
    const headers = this.getHeaders();
    return this.httpClient.get<number>(`${this.baseUrl}/count/cpf/${cpf}`, { headers });
  }

  // Inserir um novo funcionário
  insert(funcionario: Funcionario): Observable<Funcionario> {
    console.log(funcionario);  // Verifique o valor do objeto
    const data = {
      salario: funcionario.salario,
      cargo: funcionario.cargo,
      nome: funcionario.usuario.nome,
      username: funcionario.usuario.username,
      senha: funcionario.usuario.senha,
      dataNascimento: funcionario.usuario.dataNascimento,
      email: funcionario.usuario.email,
      cpf: funcionario.usuario.cpf,
      idSexo: funcionario.usuario.idSexo.id,
      telefone: {
        codigoArea: funcionario.usuario.telefone.codigoArea,
        numero: funcionario.usuario.telefone.numero,
      },
    };
    return this.httpClient.post<Funcionario>(this.baseUrl, data);
  }

  // Atualizar um funcionário
  update(funcionario: Funcionario): Observable<Funcionario> {
    const data = {
      salario: funcionario.salario,
      cargo: funcionario.cargo,
      nome: funcionario.usuario.nome,
      username: funcionario.usuario.username,
      senha: funcionario.usuario.senha,
      dataNascimento: funcionario.usuario.dataNascimento,
      email: funcionario.usuario.email,
      cpf: funcionario.usuario.cpf,
      telefone: {
        codigoArea: funcionario.usuario.telefone.codigoArea,
        numero: funcionario.usuario.telefone.numero,
      },
      idSexo: funcionario.usuario.idSexo.id,
    };
    return this.httpClient.put<Funcionario>(`${this.baseUrl}/${funcionario.id}`, data);
  }

  // Excluir um funcionário
  delete(funcionario: Funcionario): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${funcionario.id}`);
  }

  // Buscar todos os sexos
  findSexos(): Observable<Sexo[]> {
    return this.httpClient.get<Sexo[]>(`${this.baseUrl}/sexos`);
  }
}
