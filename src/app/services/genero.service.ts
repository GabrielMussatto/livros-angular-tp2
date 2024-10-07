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

  findAll(): Observable<Genero[]> {
    return this.httpClient.get<Genero[]>(this.baseUrl); 
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