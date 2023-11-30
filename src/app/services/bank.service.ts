import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bank } from '../models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor() {}

  getBanks(): Observable<Bank[]> {
    return of([{ id: '123', name: 'Bank of Fun' }]);
  }
}
