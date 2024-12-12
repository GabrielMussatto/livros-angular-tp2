import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const listOfErrors = new Array(401, 403);
        if (listOfErrors.indexOf(error.status) > -1) {
          //Redirecionar para a pagina de login em caso de nao autorizado
          this.authService.removeToken();
          this.authService.removeUsuarioLogado();
          this.authService.removeUsuarioTipo();

          const usuarioTipo = this.authService.getUsuarioTipo();
          if (usuarioTipo === 'Funcionario') {
            this.router.navigate(['/admin/login']);
          } else {
            this.router.navigate(['/inicio']);
          }
        }
        //Pode adicionar mais logica de manipulação de erros conforme necessario
        return throwError(() => error);
      })
    );
  }
}
