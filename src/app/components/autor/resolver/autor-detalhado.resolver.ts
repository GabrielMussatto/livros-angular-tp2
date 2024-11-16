import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AutorService } from '../../../services/autor.service';
import { Autor } from '../../../models/autor.model';
import { map } from 'rxjs';

export const autorDetalhadoResolver: ResolveFn<Autor> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(AutorService).findByNome(route.paramMap.get('nome')!)
    .pipe(map(autor => autor[0]));
};
