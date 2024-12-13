import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Funcionario } from '../../../models/funcionario.model';
import { FuncionarioService } from '../../../services/funcionario.service';
import { inject } from '@angular/core';

export const funcionarioResolver: ResolveFn<Funcionario> =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        return inject(FuncionarioService).findById(route.paramMap.get('id')!);
    };