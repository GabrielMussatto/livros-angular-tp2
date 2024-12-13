import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isbn',
  standalone: true
})
export class IsbnPipe implements PipeTransform {

  transform(value: string | number): string {
    if (!value) return '';

    const isbn = value.toString().replace(/\D/g, ''); // Remove caracteres não numéricos

    if (isbn.length === 13) {
      // Formato ISBN-13: XXX-X-XXX-XXXXX-X
      return isbn.replace(/(\d{3})(\d{2})(\d{3})(\d{4})(\d{1})/, '$1-$2-$3-$4-$5');
    } else {
      // Retorna o valor original caso não tenha exatamente 13 dígitos
      return value.toString();
    }
  }

}
