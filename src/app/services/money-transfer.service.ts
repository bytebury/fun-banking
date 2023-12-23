import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, first, pipe, tap } from 'rxjs';
import { BankService } from './bank.service';

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
    private readonly bankService: BankService
  ) {}

  withdrawFrom(transferDetails: TransferRequest): void {
    transferDetails.amount *= -1;
    this.http
      .post(`${environment.apiUrl}/money-transfers`, transferDetails)
      .pipe(
        first(),
        tap(() => {
          this.bankService.reload();
        })
      )
      .subscribe();
  }

  depositInto(transferDetails: TransferRequest): void {
    this.http
      .post(`${environment.apiUrl}/money-transfers`, transferDetails)
      .pipe(
        first(),
        tap(() => {
          this.bankService.reload();
        })
      )
      .subscribe();
  }

  approve(transferId: number): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/money-transfers/${transferId}/approve`,
      {}
    );
  }

  decline(transferId: number): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/money-transfers/${transferId}/decline`,
      {}
    );
  }
}
