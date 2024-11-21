// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { map, Observable } from 'rxjs';
// import { AuthService } from './services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//   ) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Observable<boolean> | Promise<boolean> | boolean {
//     return this.authService.getUsuarioLogado().pipe(
//       map((usuario) => {
//         const tokenValido = !this.authService.isTokenExpired();

//         if (!usuario || !tokenValido) {
//           this.router.navigateByUrl('/login');  // Redireciona para o login se não estiver logado ou o token expirou
//           return false;
//         }

//         const perfilRequerido = route.data['perfil']; // Perfil que a rota exige
//         if (perfilRequerido && usuario.perfil !== perfilRequerido) {
//           this.router.navigateByUrl('/login');  // Redireciona se o perfil não for permitido
//           return false;
//         }

//         return true;  // Acesso permitido
//       })
//     );
//   }
// }
