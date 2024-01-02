import { Pipe, type PipeTransform } from '@angular/core';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';

@Pipe({
  name: 'name',
  standalone: true,
})
export class NamePipe implements PipeTransform {
  transform(user: User | Customer | undefined): string {
    if (!user) {
      return '';
    }
    return `${user.first_name} ${user.last_name}`.trim();
  }
}
