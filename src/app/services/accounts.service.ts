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

  constructor(private readonly http: HttpClient) {}

  loadAccountsFor(customerId: number): void {
    this.http
      .get<BankAccount[]>(
        `${environment.apiUrl}/customers/${customerId}/accounts`
      )
      .pipe(first())
      .subscribe((accounts) => {
        this.accounts.next(accounts);
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
}
