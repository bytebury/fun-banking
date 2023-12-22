import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Transfer } from '../../../models/transfer.model';
import { AccountsService } from '../../../services/accounts.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-recent-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-transactions.component.html',
  styleUrl: './recent-transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentTransactionsComponent {
  isLoading$ = this.accountsService.isLoading$;
  completedTransfers = signal<Transfer[]>([]);

  constructor(private readonly accountsService: AccountsService) {
    this.accountsService.completedTransfers$
      .pipe(takeUntilDestroyed())
      .subscribe((transfers) => {
        this.completedTransfers.set(transfers);
      });
  }
}
