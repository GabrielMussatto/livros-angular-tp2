import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.getUsuarioLogado().pipe(
      map((usuario) => {
        const tokenValido = !this.authService.isTokenExpired();

        if (!usuario || !tokenValido || usuario.perfil !== 1) {
          this.router.navigate(['/inicio']);  // Redireciona para a página inicial se não for admin
          return false;
        }

        return true;
      })
    );
  }
}
