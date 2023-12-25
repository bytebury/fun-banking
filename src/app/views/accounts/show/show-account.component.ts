import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { BannerComponent } from '../../../components/banner/banner.component';
import { AccountsService } from '../../../services/accounts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transfer } from '../../../models/transfer.model';
import { MoneyTransferService } from '../../../services/money-transfer.service';
import { BankService } from '../../../services/bank.service';
import { Bank } from '../../../models/bank.model';
import { RouterModule } from '@angular/router';
import { RecentTransactionsComponent } from '../recent-transactions/recent-transactions.component';
import { CustomerService } from '../../../services/customer.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-show-account',
  standalone: true,
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    BannerComponent,
    RouterModule,
    RecentTransactionsComponent,
  ],
})
export class ShowAccountComponent {
  customer$ = this.customerService.customer$;
  account$ = this.accountsService.account$;
  isLoadingAccount$ = this.accountsService.isLoadingAccount$;

  pendingTransfers = signal<Transfer[]>([]);
  bank = signal<Bank | null>(null);

  constructor(
    private readonly bankService: BankService,
    private readonly accountsService: AccountsService,
    private readonly moneyTransferService: MoneyTransferService,
    private readonly customerService: CustomerService
  ) {
    this.accountsService.pendingTransfers$
      .pipe(takeUntilDestroyed())
      .subscribe((response) => {
        this.pendingTransfers.set(response.items);
      });

    this.bankService.bank$.pipe(takeUntilDestroyed()).subscribe((bank) => {
      this.bank.set(bank);
    });
  }

  approve(transferId: number): void {
    this.moneyTransferService.approve(transferId).subscribe(() => {
      this.bankService.setBank(this.bank()!.id);
      this.accountsService.account$.pipe(first()).subscribe((account) => {
        this.accountsService.getAccountInfo(account.id);
      });
    });
  }

  decline(transferId: number): void {
    this.moneyTransferService.decline(transferId).subscribe(() => {
      this.bankService.setBank(this.bank()!.id);
      this.accountsService.account$.pipe(first()).subscribe((account) => {
        this.accountsService.getAccountInfo(account.id);
      });
    });
  }
}
