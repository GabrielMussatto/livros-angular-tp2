import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Fornecedor } from '../../../models/fornecedor.model';
import { FornecedorService } from '../../../services/fornecedor.service';
import { inject } from '@angular/core';

export const fornecedorResolver: ResolveFn<Fornecedor> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(FornecedorService).findById(route.paramMap.get('id')!);
    };