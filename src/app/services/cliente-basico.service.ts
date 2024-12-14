import { Injectable } from '@angular/core';
import { ClienteBasico } from '../models/cliente-basico.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sexo } from '../models/sexo.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteBasicoService {
  private baseUrl = 'http://localhost:8080/cadastroBasicoCliente'

  constructor(
    private httpClient: HttpClient
  ) { }

  // Criar um cliente
  insert(cliente: ClienteBasico): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl, cliente);
  }

}
