import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tipoAgregaPipe' })
export class TipoAgregaPipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'B') {
      return 'ADD BUN';
    } else {
      return 'ADD BOX';
    }
  }
}