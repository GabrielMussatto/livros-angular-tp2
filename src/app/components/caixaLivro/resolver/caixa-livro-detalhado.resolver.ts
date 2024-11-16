import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { CaixaLivroService } from '../../../services/caixa-livro.service';
import { CaixaLivro } from '../../../models/caixa-livro.model';

export const caixaLivroDetalhadoResolver: ResolveFn<CaixaLivro> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return inject(CaixaLivroService).findByNome(route.paramMap.get('nome')!)
    .pipe(map(livro => livro[0]));
};