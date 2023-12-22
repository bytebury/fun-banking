import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  first,
  switchMap,
  tap,
} from 'rxjs';
import { BankAccount } from '../models/bank-account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transfer } from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly isLoading = new BehaviorSubject(true);
  private readonly isLoadingAccount = new BehaviorSubject(true);
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
    this.isLoadingAccount.next(true);
    this.http
      .get<BankAccount>(`${environment.apiUrl}/accounts/${accountId}`)
      .pipe(first())
      .subscribe((account) => {
        this.account.next(account);
        this.isLoadingAccount.next(false);
      });
  }

  get pendingTransfers$(): Observable<Transfer[]> {
    this.isLoading.next(true);
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<Transfer[]>(
          `${environment.apiUrl}/accounts/${account.id}/money-transfers?status=pending`
        );
      }),
      tap(() => {
        this.isLoading.next(false);
      })
    );
  }

  get completedTransfers$(): Observable<Transfer[]> {
    this.isLoading.next(true);
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<Transfer[]>(
          `${environment.apiUrl}/accounts/${account.id}/money-transfers?status=approved&status=declined`
        );
      }),
      tap(() => {
        this.isLoading.next(false);
      })
    );
  }

  get account$(): Observable<BankAccount> {
    return this.account.asObservable().pipe(filter(Boolean));
  }

  get accounts$(): Observable<BankAccount[]> {
    return this.accounts.asObservable();
  }

  get isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  get isLoadingAccount$(): Observable<boolean> {
    return this.isLoadingAccount.asObservable();
  }
}
