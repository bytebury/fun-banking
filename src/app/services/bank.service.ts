import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Bank } from '../models/bank.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer.model';

interface BankInfo {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private readonly banks = new BehaviorSubject<Bank[]>([]);
  private readonly bank = new BehaviorSubject<Bank | null>(null);
  private readonly customers = new BehaviorSubject<Customer[]>([]);

  constructor(private readonly http: HttpClient) {
    if (this.banks.value.length === 0) {
      this.loadBanks();
    }
  }

  setBank(bankId: number): void {
    this.http
      .get<Bank>(`${environment.apiUrl}/banks/${bankId}`)
      .pipe(
        first(),
        tap((bank) => this.bank.next(bank)),
        switchMap((bank) => {
          return this.http.get<Customer[]>(
            `${environment.apiUrl}/banks/${bank.id}/customers`
          );
        })
      )
      .subscribe((customers) => {
        this.customers.next(customers);
      });
  }

  removeCustomer(customerId: number): void {
    const customers = this.customers.value.filter(
      (customer) => customer.id !== customerId
    );
    this.customers.next(customers);
  }

  create(bankInfo: BankInfo): Observable<Bank> {
    const request = { ...bankInfo, slug: this.generateSlug(bankInfo.name) };
    return this.http.post<Bank>(`${environment.apiUrl}/banks`, request);
  }

  update(bankInfo: BankInfo): Observable<Bank> {
    const request = { ...bankInfo, slug: this.generateSlug(bankInfo.name) };
    return this.http
      .put<Bank>(`${environment.apiUrl}/banks/${this.bank.value?.id}`, request)
      .pipe(tap(() => this.loadBanks()));
  }

  destroy(bankId: number): Observable<unknown> {
    return this.http.delete(`${environment.apiUrl}/banks/${bankId}`).pipe(
      tap(() => {
        const keepBanks = this.banks.value.filter((bank) => bank.id !== bankId);
        this.banks.next(keepBanks);
      })
    );
  }

  get banks$(): Observable<Bank[]> {
    return this.banks.asObservable();
  }

  get bank$(): Observable<Bank> {
    return this.bank.asObservable().pipe(filter(Boolean));
  }

  get customers$(): Observable<Customer[]> {
    return this.customers.asObservable().pipe(
      map((customers) =>
        customers.map((customer) => {
          return {
            ...customer,
            bankBalance: customer.accounts.reduce((a, b) => a + b.balance, 0),
          };
        })
      )
    );
  }

  private loadBanks(): void {
    this.http
      .get<Bank[]>(`${environment.apiUrl}/banks`)
      .pipe(first())
      .subscribe((banks) => {
        this.banks.next(banks);
      });
  }

  private generateSlug(name: string): string {
    if (!name) {
      return '';
    }
    return name.trim().toLowerCase().replaceAll(/\s+/g, '-');
  }
}
