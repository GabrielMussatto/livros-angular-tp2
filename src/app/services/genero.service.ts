import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Genero } from '../models/genero.model';

@Injectable({
  providedIn: 'root'
})
export class GeneroService {

  private baseUrl = 'http://localhost:8080/generos';

  constructor(private httpClient: HttpClient) {
  }

  findAll(page?: number, pageSize?: number): Observable<Genero[]>{
    let params = {};
  
    if(page !== undefined && pageSize !== undefined){
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    
    return this.httpClient.get<Genero[]>(this.baseUrl, {params});
  }

  count(): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countBynome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Genero[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Genero[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }
  
  findById(id: string): Observable<Genero> {
    return this.httpClient.get<Genero>(`${this.baseUrl}/${id}`); 
  }

  insert(genero: Genero): Observable<Genero>{
    const data = {
      nome: genero.nome,
      descricao: genero.descricao
    }
    return this.httpClient.post<Genero>(this.baseUrl, data);
  }

  update(genero: Genero): Observable<Genero>{
    const data = {
      nome: genero.nome,
      descricao: genero.descricao
    }
    return this.httpClient.put<Genero>(`${this.baseUrl}/${genero.id}`, data);
  }

  delete(genero: Genero): Observable<any> { // pode passar o objeto inteiro se quiser (genero: Genero) -  any = void, sem retorno pq ta excluido
    return this.httpClient.delete<any>(`${this.baseUrl}/${genero.id}`);
  }
}