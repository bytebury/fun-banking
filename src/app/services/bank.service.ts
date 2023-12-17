import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, first, of } from 'rxjs';
import { Bank } from '../models/bank.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private readonly banks = new BehaviorSubject<Bank[]>([]);
  private readonly bank = new BehaviorSubject<Bank | null>(null);

  constructor(private readonly http: HttpClient) {
    if (this.banks.value.length === 0) {
      this.loadBanks();
    }
  }

  setBank(bankId: string): void {
    this.http
      .get<Bank>(`${environment.apiUrl}/banks/${bankId}`)
      .pipe(first())
      .subscribe((bank) => {
        this.bank.next(bank);
      });
  }

  get banks$(): Observable<Bank[]> {
    return this.banks.asObservable();
  }

  get bank$(): Observable<Bank | null> {
    return this.bank.asObservable();
  }

  private loadBanks(): void {
    this.http
      .get<Bank[]>(`${environment.apiUrl}/banks`)
      .pipe(first())
      .subscribe((banks) => {
        this.banks.next(banks);
      });
  }
}
