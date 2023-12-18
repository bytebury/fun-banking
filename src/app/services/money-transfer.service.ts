import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { first } from 'rxjs';

interface TransferRequest {
  amount: number;
  description: string;
  account_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class MoneyTransferService {
  constructor(private readonly http: HttpClient) {}

  withdrawFrom(transferDetails: TransferRequest): void {
    transferDetails.amount *= -1;
    this.http
      .post(`${environment.apiUrl}/money-transfers`, transferDetails)
      .pipe(first())
      .subscribe();
  }

  depositInto(transferDetails: TransferRequest): void {
    this.http
      .post(`${environment.apiUrl}/money-transfers`, transferDetails)
      .pipe(first())
      .subscribe();
  }
}
