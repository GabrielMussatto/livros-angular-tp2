import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { Livro } from '../../../models/livro.model';
import { LivroService } from '../../../services/livro.service';

export const livroDetalhadoResolver: ResolveFn<Livro> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(LivroService).findByTitulo(route.paramMap.get('titulo')!)
    .pipe(map(livro => livro[0]));
};