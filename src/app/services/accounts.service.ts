import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  filter,
  first,
  map,
  switchMap,
} from 'rxjs';
import { BankAccount } from '../models/bank-account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transfer } from '../models/transfer.model';
import { PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private readonly isLoadingAccount = new BehaviorSubject(true);
  private readonly account = new BehaviorSubject<BankAccount | null>(null);
  private readonly accounts = new BehaviorSubject<BankAccount[]>([]);
  private readonly completedTransferPage = signal(1);

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

  setCompletedTransferPage(page: number): void {
    this.completedTransferPage.set(page);
    this.account.next(this.account.value);
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

  get pendingTransfers$(): Observable<PaginatedResponse<Transfer>> {
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<PaginatedResponse<Transfer>>(
          `${environment.apiUrl}/accounts/${account.id}/transactions?status=pending`
        );
      })
    );
  }

  get thirtyDaysRollingTransfers$(): Observable<
    { date: Date; total_balance: number }[]
  > {
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<{ date: Date; total_balance: number }[]>(
          `${environment.apiUrl}/accounts/${account.id}/insights/transactions`,
          { params: { 'days-ago': 30 } }
        );
      })
    );
  }

  get completedTransfers$(): Observable<PaginatedResponse<Transfer>> {
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<PaginatedResponse<Transfer>>(
          `${environment.apiUrl}/accounts/${
            account.id
          }/transactions?status=approved&status=declined&limit=5&page=${this.completedTransferPage()}`
        );
      })
    );
  }

  get account$(): Observable<BankAccount> {
    return this.account.asObservable().pipe(filter(Boolean));
  }

  get accounts$(): Observable<BankAccount[]> {
    return this.accounts.asObservable();
  }

  get isLoadingAccount$(): Observable<boolean> {
    return this.isLoadingAccount.asObservable();
  }
}
