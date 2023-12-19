import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { BankAccount } from '../../../models/bank-account.model';
import { BannerComponent } from '../../../components/banner/banner.component';
import { AccountsService } from '../../../services/accounts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Transfer } from '../../../models/transfer.model';
import { MoneyTransferService } from '../../../services/money-transfer.service';
import { BankService } from '../../../services/bank.service';
import { Bank } from '../../../models/bank.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-show-account',
  standalone: true,
  imports: [CommonModule, BannerComponent, RouterModule],
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAccountComponent {
  @Input({ required: true }) account: BankAccount | null = null;

  pendingTransfers = signal<Transfer[]>([]);
  completedTransfers = signal<Transfer[]>([]);
  bank = signal<Bank | null>(null);

  constructor(
    private readonly bankService: BankService,
    private readonly accountsService: AccountsService,
    private readonly moneyTransferService: MoneyTransferService
  ) {
    this.accountsService.pendingTransfers$
      .pipe(takeUntilDestroyed())
      .subscribe((pendingTransfers) => {
        this.pendingTransfers.set(pendingTransfers);
      });

    this.accountsService.completedTransfers$
      .pipe(takeUntilDestroyed())
      .subscribe((transfers) => {
        this.completedTransfers.set(transfers);
      });

    this.bankService.bank$.pipe(takeUntilDestroyed()).subscribe((bank) => {
      this.bank.set(bank);
    });
  }

  approve(transferId: number): void {
    this.moneyTransferService.approve(transferId).subscribe(() => {
      this.accountsService.getAccountInfo(this.account!.id);
      this.bankService.setBank(this.bank()!.id);
    });
  }

  decline(transferId: number): void {
    this.moneyTransferService.decline(transferId).subscribe(() => {
      this.accountsService.getAccountInfo(this.account!.id);
      this.bankService.setBank(this.bank()!.id);
    });
  }
}
