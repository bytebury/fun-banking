import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customers: Customer[] = [
    {
      id: '1',
      first_name: 'Michael',
      last_name: 'Scott',
      balance: 20_432.64,
      pin: '123456',
    },
    {
      id: '1',
      first_name: 'Dwight',
      last_name: 'Schrute',
      balance: 90,
      pin: '123457',
    },
  ];

  getCustomers(_bankId: string): Observable<Customer[]> {
    return of<Customer[]>(this.customers);
  }
}
