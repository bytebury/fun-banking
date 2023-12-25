import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';
import { BankService } from './bank.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountsService } from './accounts.service';

interface CustomerInfo {
  first_name: string;
  last_name: string;
  pin: string;
}

interface CreateCustomerRequest extends CustomerInfo {
  bank_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly customer = new BehaviorSubject<Customer | null>(null);

  constructor(
    private readonly http: HttpClient,
    private readonly bankService: BankService,
    private readonly accountsService: AccountsService
  ) {}

  create(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(`${environment.apiUrl}/customers`, request);
  }

  update(customerId: number, customerInfo: CustomerInfo): Observable<Customer> {
    return this.http
      .put<Customer>(
        `${environment.apiUrl}/customers/${customerId}`,
        customerInfo
      )
      .pipe(
        tap(() => {
          this.bankService.reload();
        })
      );
  }

  destroy(customerId: number): Observable<unknown> {
    return this.http
      .delete<unknown>(`${environment.apiUrl}/customers/${customerId}`)
      .pipe(
        tap(() => {
          this.bankService.reload();
        })
      );
  }

  setCustomer(customer: Customer): void {
    this.customer.next(customer);
  }

  get customer$(): Observable<Customer> {
    return this.customer.asObservable().pipe(filter(Boolean));
  }
}
