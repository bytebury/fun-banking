import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Customer } from '../models/customer.model';
import { BankAccount } from '../models/bank-account.model';

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

  updateCustomer(_customer: Customer): Observable<any> {
    return of(null);
  }

  createCustomer(
    _bankId: string,
    _customer: Omit<Customer, 'id'>
  ): Observable<Customer> {
    return of(this.customers[0]);
  }

  getBankAccounts(_customerId: string): Observable<BankAccount[]> {
    return of([
      { id: '123', name: 'My Checkings Account', balance: 20_432.64 },
    ]);
  }
}
