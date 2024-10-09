import { ResolveFn } from '@angular/router';

export const livroResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
