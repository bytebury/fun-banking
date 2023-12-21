import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, first, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';
import { HttpClient } from '@angular/common/http';
import { Severity } from '../models/severity.enum';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class CustomerAuthService {
  private readonly customer = new BehaviorSubject<Customer | null>(null);

  bank = signal<{ username: string; slug: string } | null>(null);

  readonly customer$ = this.customer.asObservable();
  readonly isLoggedIn$ = this.customer$.pipe(map((customer) => !!customer));

  errorMessage = signal({
    severity: Severity.Default,
    exclamation: '❌',
    message: '',
  });

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const customer = sessionStorage.getItem('customer');
    const bank = sessionStorage.getItem('bank');

    if (customer) {
      this.customer.next(JSON.parse(customer));
    }

    if (bank) {
      this.bank.set(JSON.parse(bank));
    }
  }

  signIn(bank_id: string | number, pin: string): void {
    this.http
      .post<Customer>(`${environment.apiUrl}/customers/signin`, {
        bank_id,
        pin,
      })
      .pipe(first())
      .subscribe({
        next: (customer: Customer) => {
          this.errorMessage.update((value) => ({ ...value, message: '' }));
          sessionStorage.setItem('customer', JSON.stringify(customer));
          this.customer.next(customer);
          this.router.navigate(['/', 'customers', 'welcome']);
        },
        error: (error) => {
          this.errorMessage.update((value) => ({
            ...value,
            message: error.error.message,
          }));
        },
      });
  }

  logout(): void {
    sessionStorage.removeItem('customer');
    this.customer.next(null);
    this.router.navigate(['/', this.bank()?.username, this.bank()?.slug]);
  }

  setCurrentBank(bankInfo: { username: string; slug: string }): void {
    this.bank.set(bankInfo);
    sessionStorage.setItem('bank', JSON.stringify(bankInfo));
  }
}
