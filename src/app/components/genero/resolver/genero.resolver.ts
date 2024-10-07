import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Genero } from '../../../models/genero.model';
import { GeneroService } from '../../../services/genero.service';
import { inject } from '@angular/core';

export const generoResolver: ResolveFn<Genero> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(GeneroService).findById(route.paramMap.get('id')!);
    };