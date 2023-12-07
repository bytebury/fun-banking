import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Bank } from '../models/bank.model';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor() {}

  getBanks(): Observable<Bank[]> {
    return of([
      {
        id: '123',
        owner: {
          username: 'marcello',
          first_name: 'Marcello',
          last_name: 'Sabino',
          avatar: 'https://avatars.githubusercontent.com/u/104793781?v=4',
        },
        name: 'Bank of Fun',
        slug: 'bank-of-fun',
      },
      {
        id: '124',
        owner: {
          username: 'marcello',
          first_name: 'Marcello',
          last_name: 'Sabino',
          avatar: 'https://avatars.githubusercontent.com/u/104793781?v=4',
        },
        name: 'Kingswoods Bank',
        slug: 'kingswoods-bank',
      },
    ]);
  }
}
