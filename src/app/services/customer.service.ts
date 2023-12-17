import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

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
  constructor(private readonly http: HttpClient) {}

  create(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(`${environment.apiUrl}/customers`, request);
  }

  update(customerId: number, customerInfo: CustomerInfo): Observable<Customer> {
    return this.http.put<Customer>(
      `${environment.apiUrl}/customers/${customerId}`,
      customerInfo
    );
  }
}
