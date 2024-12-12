import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cupom } from '../models/cupom.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CupomService {
  private baseUrl = 'http://localhost:8080/cupons';

  constructor(private httpClient: HttpClient) {}

  findAll(page?: number, pageSize?: number): Observable<Cupom[]> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }

    return this.httpClient.get<Cupom[]>(this.baseUrl, { params });
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  countBynome(nome: string): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count/search/${nome}`);
  }

  findByNomeCupom(
    nomeCupom: string,
    page?: number,
    pageSize?: number
  ): Observable<Cupom[]> {
    let params = {};
    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString(),
      };
    }
    return this.httpClient.get<Cupom[]>(
      `${this.baseUrl}/search/nomeCupom/${nomeCupom}`,
      { params }
    );
  }

  findById(id: string): Observable<Cupom> {
    return this.httpClient.get<Cupom>(`${this.baseUrl}/${id}`);
  }

  insert(cupom: Cupom): Observable<Cupom> {
    const data = {
      nomeCupom: cupom.nomeCupom,
      desconto: cupom.desconto,
    };
    return this.httpClient.post<Cupom>(this.baseUrl, data);
  }

  update(cupom: Cupom): Observable<Cupom> {
    const data = {
      nomeCupom: cupom.nomeCupom,
      desconto: cupom.desconto,
    };
    return this.httpClient.put<Cupom>(`${this.baseUrl}/${cupom.id}`, data);
  }

  delete(cupom: Cupom): Observable<any> {
    // pode passar o objeto inteiro se quiser (cupom: Cupom) -  any = void, sem retorno pq ta excluido
    return this.httpClient.delete<any>(`${this.baseUrl}/${cupom.id}`);
  }
}
