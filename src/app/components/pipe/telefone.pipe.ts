import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
  standalone: true
})
export class TelefonePipe implements PipeTransform {

  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }

    // Remove todos os caracteres não numéricos
    const cleaned = value.replace(/\D/g, '');

    // Formata o número no formato xxxxx-xxxx
    const match = cleaned.match(/^(\d{5})(\d{4})$/);

    if (match) {
      return `${match[1]}-${match[2]}`;
    }

    return value;
  }

}
