import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first } from 'rxjs';
import { BankAccount } from '../models/bank-account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly account = new BehaviorSubject<BankAccount | null>(null);
  private readonly accounts = new BehaviorSubject<BankAccount[]>([]);
  private readonly totalBalance = new BehaviorSubject<number>(0);

  constructor(private readonly http: HttpClient) {}

  loadAccountsFor(customerId: number): void {
    this.http
      .get<BankAccount[]>(
        `${environment.apiUrl}/customers/${customerId}/accounts`
      )
      .pipe(first())
      .subscribe((accounts) => {
        this.accounts.next(accounts);
        this.totalBalance.next(accounts.reduce((a, b) => a + b.balance, 0));
      });
  }

  getAccountInfo(accountId: number): void {
    this.http
      .get<BankAccount>(`${environment.apiUrl}/accounts/${accountId}`)
      .pipe(first())
      .subscribe((account) => {
        this.account.next(account);
      });
  }

  get account$(): Observable<BankAccount> {
    return this.account.asObservable().pipe(filter(Boolean));
  }

  get accounts$(): Observable<BankAccount[]> {
    return this.accounts.asObservable();
  }

  get totalBalance$(): Observable<number> {
    return this.totalBalance.asObservable();
  }
}
