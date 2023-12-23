import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { AccountsService } from '../../../services/accounts.service';
import { Transfer } from '../../../models/transfer.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-transactions.component.html',
  styleUrl: './recent-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentTransactionsComponent {
  isLoading = signal(true);
  completedTransfers = signal<Transfer[]>([]);

  constructor(private readonly accountsService: AccountsService) {
    this.accountsService.completedTransfers$.subscribe((transfers) => {
      this.completedTransfers.set(transfers);
      this.isLoading.set(false);
    });

    this.accountsService.account$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe(() => {
        this.isLoading.set(true);
      });
  }
}
