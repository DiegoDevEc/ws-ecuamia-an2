import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseDate'
})
export class ReverseDatePipe implements PipeTransform {
  transform(value: string): string {
    const parts = value.split('-');
    if (parts.length !== 3) {
      return value;
    }

    return `${parts[1]}/${parts[0]}/${parts[2]}`;
  }
}