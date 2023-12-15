import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../../../models/bank-account.model';
import { Severity } from '../../../models/severity.enum';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { BannerComponent } from '../../../components/banner/banner.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, BannerComponent, RouterModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnChanges {
  @Input({ required: true }) customer: Customer | null = null;

  bankAccounts$: Observable<BankAccount[]> = of([]);

  severity = Severity.Info;

  constructor(
    private readonly router: Router,
    private readonly customerService: CustomerService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customer) {
      this.bankAccounts$ = this.customerService.getBankAccounts(
        this.customer!.id
      );
    }
  }

  openAccount(accountId: string): void {
    this.router.navigate(['accounts', accountId]);
  }
}
