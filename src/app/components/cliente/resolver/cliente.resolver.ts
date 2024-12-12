import { ResolveFn } from '@angular/router';

export const clienteResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
