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
import { Severity } from '../../../models/severity.enum';
import { Customer } from '../../../models/customer.model';
import { BannerComponent } from '../../../components/banner/banner.component';
import { AccountsService } from '../../../services/accounts.service';

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
  @Output() opened = new EventEmitter<number>();

  bankAccounts$ = this.accountService.accounts$;
  severity = Severity.Info;

  constructor(private readonly accountService: AccountsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customer) {
      this.accountService.loadAccountsFor(this.customer.id);
    }
  }

  openAccount(accountId: number): void {
    this.opened.emit(accountId);
  }
}
