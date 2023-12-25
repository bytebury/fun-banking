import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, first, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { Employee } from '../models/employee.model';
import { BankService } from './bank.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly banks = new BehaviorSubject<any | null>(null);
  private readonly employees = new BehaviorSubject<Employee[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly userService: UserService,
    private readonly auth: AuthService,
    private readonly bankService: BankService
  ) {
    this.auth.isLoggedIn$
      .pipe(takeUntilDestroyed(), filter(Boolean))
      .subscribe({
        next: () => {
          this.loadBanks();
        },
      });

    this.bankService.bank$.pipe(takeUntilDestroyed()).subscribe((bank) => {
      this.loadEmployees(bank.id);
    });
  }

  create(employee: { email: string; bank_id: number }): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/employees`, employee);
  }

  private loadBanks(): void {
    this.userService.currentUser$
      .pipe(
        filter(Boolean),
        switchMap((user) => {
          return this.http.get(
            `${environment.apiUrl}/employees/user/${user.id}`
          );
        })
      )
      .subscribe((response) => {
        this.banks.next(response);
      });
  }

  private loadEmployees(bankId: number): void {
    this.http
      .get<Employee[]>(`${environment.apiUrl}/employees/bank/${bankId}`)
      .pipe(first())
      .subscribe((employees) => {
        this.employees.next(employees);
      });
  }

  get banks$(): Observable<any | null> {
    return this.banks.asObservable();
  }

  get employees$(): Observable<Employee[]> {
    return this.employees.asObservable();
  }
}
