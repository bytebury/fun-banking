import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedNumber',
  standalone: true,
})
export class FormattedNumberPipe implements PipeTransform {
  transform(value: number | string): string {
    value = Number(value);

    if (value >= 1_000_000) {
      value = (value / 1_000_000).toFixed(1);

      if (value.endsWith('.0')) {
        return value.split('.')[0] + 'M';
      }

      return value + 'M';
    }

    if (value >= 1_000) {
      value = (value / 1_000).toFixed(1);

      if (value.endsWith('.0')) {
        return value.split('.')[0] + 'K';
      }

      return value + 'K';
    }

    return value.toString();
  }
}
