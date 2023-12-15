import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../models/bank-account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  getAccount(_accountId: string): Observable<BankAccount> {
    return of({
      id: '123',
      name: "Marcello's Checking",
      balance: 20_434.23,
    });
  }
}
