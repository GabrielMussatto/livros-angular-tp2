import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Autor } from '../models/autor.model';

@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private baseUrl = 'http://localhost:8080/autores';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Autor[]>{
    return this.httpClient.get<Autor[]>(this.baseUrl);
  }

  findById(id: string): Observable<Autor>{
    return this.httpClient.get<Autor>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string): Observable<Autor[]>{
    return this.httpClient.get<Autor[]>(`${this.baseUrl}/search/nome/${nome}`);
  }

  findByBiografia(biografia: string): Observable<Autor[]>{
    return this.httpClient.get<Autor[]>(`${this.baseUrl}/search/biografia/${biografia}`);
  }

  insert(autor: Autor): Observable<Autor>{
    const data = {
      nome: autor.nome,
      biografia: autor.biografia
    };
    return this.httpClient.post<Autor>(this.baseUrl, data);
  }

  update(autor: Autor): Observable<Autor>{
    const data = {
      nome: autor.nome,
      biografia: autor.biografia
    };
    return this.httpClient.put<Autor>(`${this.baseUrl}/${autor.id}`, data);
  }

  delete(autor: Autor): Observable<any>{
    return this.httpClient.delete<any>(`${this.baseUrl}/${autor.id}`);
  }
}
