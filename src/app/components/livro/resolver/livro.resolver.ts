import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { LivroService } from '../../../services/livro.service';
import { Livro } from '../../../models/livro.model';

export const livroResolver: ResolveFn<Livro> = 
(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(LivroService).findById(route.paramMap.get('id')!);
};
