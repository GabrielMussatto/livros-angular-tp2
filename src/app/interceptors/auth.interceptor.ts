import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //obtem o token jwt
    const authToken = this.authService.getToken();
  
    //clona a solicitação e adiciona o cabeçalho de autorização
    if (authToken) {
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next.handle(authRequest);
    }
    //se nao houver token, apenas passa a solicitaçao sem modificação
    return next.handle(request);
  }
}
