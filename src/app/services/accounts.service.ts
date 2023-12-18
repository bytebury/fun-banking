import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first, switchMap } from 'rxjs';
import { BankAccount } from '../models/bank-account.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Transfer } from '../models/transfer.model';

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

  get pendingTransfers$(): Observable<Transfer[]> {
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<Transfer[]>(
          `${environment.apiUrl}/accounts/${account.id}/money-transfers?status=pending`
        );
      })
    );
  }

  get completedTransfers$(): Observable<Transfer[]> {
    return this.account$.pipe(
      switchMap((account) => {
        return this.http.get<Transfer[]>(
          `${environment.apiUrl}/accounts/${account.id}/money-transfers?status=approved&status=declined`
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
}
