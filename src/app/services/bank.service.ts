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
import { AuthService } from './auth.service';

interface BankInfo {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private readonly isLoading = new BehaviorSubject(true);
  private readonly banks = new BehaviorSubject<Bank[]>([]);
  private readonly bank = new BehaviorSubject<Bank | null>(null);
  private readonly customers = new BehaviorSubject<Customer[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService
  ) {
    this.auth.isLoggedIn$.pipe(filter(Boolean)).subscribe(() => {
      if (this.banks.value.length === 0) {
        this.loadBanks();
      }
    });
  }

  findBankByUsernameAndSlug(username: string, slug: string): void {
    this.http
      .get<Bank>(`${environment.apiUrl}/${username}/${slug}`)
      .pipe(first())
      .subscribe((bank) => {
        this.bank.next(bank);
      });
  }

  setBank(bankId: number): void {
    this.bank.next(null);
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
    return this.http
      .post<Bank>(`${environment.apiUrl}/banks`, request)
      .pipe(tap(() => this.loadBanks()));
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

  clear(): void {
    this.bank.next(null);
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

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  private loadBanks(): void {
    this.isLoading.next(true);
    this.http
      .get<Bank[]>(`${environment.apiUrl}/banks`)
      .pipe(first())
      .subscribe({
        next: (banks) => {
          this.banks.next(banks);
          this.isLoading.next(false);
        },
        error: () => {
          this.isLoading.next(false);
        },
      });
  }

  private generateSlug(name: string): string {
    if (!name) {
      return '';
    }
    return name.trim().toLowerCase().replaceAll(/\s+/g, '-');
  }
}
