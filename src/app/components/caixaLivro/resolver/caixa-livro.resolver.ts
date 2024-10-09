import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CaixaLivro } from '../../../models/caixa-livro.model';

export const caixaLivroResolver: ResolveFn<CaixaLivro> = 
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(CaixaLivroService).findById(route.paramMap.get('id')!);
    };
