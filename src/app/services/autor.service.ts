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

  getUrlImage(nomeImagem: string): string{
    return `${this.baseUrl}/image/download/${nomeImagem}`;
  }
  
  findAll(page?: number, pageSize?: number): Observable<Autor[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }

    return this.httpClient.get<Autor[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }
  
  countBynome(nome: string): Observable<number>{
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }
  
  findById(id: string): Observable<Autor> {
    return this.httpClient.get<Autor>(`${this.baseUrl}/${id}`);
  }

  findByNome(nome: string, page?: number, pageSize?: number): Observable<Autor[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<Autor[]>(`${this.baseUrl}/search/nome/${nome}`, { params });
  }

  findByBiografia(biografia: string): Observable<Autor[]> {
    return this.httpClient.get<Autor[]>(`${this.baseUrl}/search/biografia/${biografia}`);
  }

  insert(autor: Autor): Observable<Autor> {
    const data = {
      nome: autor.nome,
      biografia: autor.biografia
    };
    return this.httpClient.post<Autor>(this.baseUrl, data);
  }

  update(autor: Autor): Observable<Autor> {
    const data = {
      nome: autor.nome,
      biografia: autor.biografia
    };
    return this.httpClient.put<Autor>(`${this.baseUrl}/${autor.id}`, data);
  }

  delete(autor: Autor): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${autor.id}`);
  }
}
