import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Cliente } from '../../../models/cliente.model';
import { ClienteService } from '../../../services/cliente.service';
import { inject } from '@angular/core';

export const clienteResolver: ResolveFn<Cliente> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(ClienteService).findById(route.paramMap.get('id')!);
    };