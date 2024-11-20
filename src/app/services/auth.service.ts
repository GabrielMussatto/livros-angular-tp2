import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { LocalStorageService } from './local-storage.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth';
  private tokenKey = 'jwt_token';
  private usuarioLogadoKey = 'usuario_logado';
  private usuarioLogadoSubject = new BehaviorSubject<Usuario | null>(null);

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    private jwtHelper: JwtHelperService
  ) {
    this.initUsuarioLogado();
  }

  private initUsuarioLogado(): void {
    const usuario = this.localStorageService.getItem(this.usuarioLogadoKey);
    if (usuario) {
      // Atribuindo o objeto do usuário diretamente ao BehaviorSubject
      this.usuarioLogadoSubject.next(usuario);
    }
  } 

  public login(username: string, senha: string, perfil: number): Observable<any> {
    const params = {
      username: username,
      senha: senha,
      perfil: perfil // perfil dinâmico
    };
  
    return this.httpClient.post(`${this.baseUrl}`, params, { observe: 'response' }).pipe(
      tap((res: any) => {
        const authToken = res.headers.get('Authorization') ?? '';
        if (authToken) {
          this.setToken(authToken);
          const usuarioLogado = res.body;
          if (usuarioLogado) {
            const usuarioParaArmazenar = {
              id: usuarioLogado.id,
              username: usuarioLogado.username,
              perfil: usuarioLogado.perfil
            };
            this.setUsuarioLogado(usuarioParaArmazenar);
            this.usuarioLogadoSubject.next(usuarioParaArmazenar);
          }
        }
      }),
      catchError((error) => {
        console.error('Erro ao realizar login:', error);
        return throwError(() => new Error('Erro ao realizar login'));
      })
    );
    
  }

  setUsuarioLogado(usuario: { id: number; username: string; perfil: number }): void {
    this.localStorageService.setItem(this.usuarioLogadoKey, usuario);
  }

  setToken(token: string): void {
    this.localStorageService.setItem(this.tokenKey, token);
  }

  getUsuarioLogado() {
    return this.usuarioLogadoSubject.asObservable();
  }

  getToken(): string | null {
    return this.localStorageService.getItem(this.tokenKey);
  }

  removeToken(): void {
    this.localStorageService.removeItem(this.tokenKey);
  }

  removeUsuarioLogado(): void {
    this.localStorageService.removeItem(this.usuarioLogadoKey); // Remove apenas as informações essenciais
    this.usuarioLogadoSubject.next(null); // Reseta o estado do usuário no BehaviorSubject
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      return this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      console.error('Token inválido', error);
      return true;
    }
  }
}