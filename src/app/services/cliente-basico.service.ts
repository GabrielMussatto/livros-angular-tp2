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
  insert(cliente: ClienteBasico): Observable<ClienteBasico> {
    const data = {
      cep: cliente.cep,
      endereco: cliente.endereco,
      estado: cliente.estado,
      sigla: cliente.sigla,
      cidade: cliente.cidade,
      nome: cliente.nome,
      username: cliente.username,
      senha: cliente.senha,
      dataNascimento: cliente.dataNascimento,
      email: cliente.email,
      cpf: cliente.cpf,
      telefone: {
        codigoArea: cliente.telefone.codigoArea,
        numero: cliente.telefone.numero,
      },
      idSexo: cliente.idSexo.id
    }
    return this.httpClient.post<ClienteBasico>(this.baseUrl, data);
  }

  findSexos(): Observable<Sexo[]> {
      return this.httpClient.get<Sexo[]>(`${this.baseUrl}/sexos`);
    }

}
