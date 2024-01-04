import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, first, pipe, tap } from 'rxjs';
import { BankService } from './bank.service';
import { AccountsService } from './accounts.service';

interface TransferRequest {
  amount: number;
  description: string;
  account_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class MoneyTransferService {
  constructor(
    private readonly http: HttpClient,
    private readonly bankService: BankService,
    private readonly accountService: AccountsService
  ) {}

  withdrawFrom(transferDetails: TransferRequest): Observable<void> {
    transferDetails.amount *= -1;
    return this.http
      .post<void>(`${environment.apiUrl}/transactions`, transferDetails)
      .pipe(
        first(),
        tap(() => {
          this.bankService.reload();
          this.accountService.getAccountInfo(transferDetails.account_id);
        })
      );
  }

  depositInto(transferDetails: TransferRequest): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/transactions`, transferDetails)
      .pipe(
        first(),
        tap(() => {
          this.bankService.reload();
        })
      );
  }

  approve(transferId: number): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/transactions/${transferId}/approve`,
      {}
    );
  }

  decline(transferId: number): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/transactions/${transferId}/decline`,
      {}
    );
  }
}
