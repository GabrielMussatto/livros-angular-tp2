import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Editora } from '../models/editora.model';

@Injectable({
  providedIn: 'root',
})
export class EditoraService {
  private baseUrl = 'http://localhost:8080/editoras';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Editora[]>{
    let params = {};
  
    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    
    return this.httpClient.get<Editora[]>(this.baseUrl, {params});
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countBynome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Editora[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Editora[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  // Método para buscar uma editora pelo ID
  findById(id: string): Observable<Editora> {
    return this.httpClient.get<Editora>(`${this.baseUrl}/${id}`);
  }

  // Método para inserir uma nova editora
  insert(editora: Editora): Observable<Editora> {
    const data = {
      nome: editora.nome,
      email: editora.email,
      endereco: editora.endereco,
      estado: editora.estado,
      telefone: {
        codigoArea: editora.telefone.codigoArea,
        numero: editora.telefone.numero,
      },
    };
    return this.httpClient.post<Editora>(this.baseUrl, data);
  }

  // Método para atualizar uma editora existente
  update(editora: Editora): Observable<Editora> {
    const data = {
      nome: editora.nome,
      email: editora.email,
      endereco: editora.endereco,
      estado: editora.estado,
      telefone: {
        codigoArea: editora.telefone.codigoArea,
        numero: editora.telefone.numero,
      },
    };
    return this.httpClient.put<Editora>(`${this.baseUrl}/${editora.id}`, data);
  }

  // Método para deletar uma editora
  delete(editora: Editora): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${editora.id}`);
  }
}