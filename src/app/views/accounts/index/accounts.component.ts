import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../../../models/bank-account.model';
import { Severity } from '../../../models/severity.enum';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnChanges {
  @Input({ required: true }) customer: Customer | null = null;
  @Output() opened = new EventEmitter<string>();

  bankAccounts$: Observable<BankAccount[]> = of([]);
  severity = Severity.Info;

  constructor(private readonly customerService: CustomerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customer) {
      // this.bankAccounts$ = this.customerService.getBankAccounts(
      //   this.customer!.id
      // );
    }
  }

  openAccount(accountId: string): void {
    this.opened.emit(accountId);
  }
}
