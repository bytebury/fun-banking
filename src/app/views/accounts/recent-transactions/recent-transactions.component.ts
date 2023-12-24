import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
  noNextPage = signal(false);

  page = signal(1);

  constructor(private readonly accountsService: AccountsService) {
    this.accountsService.completedTransfers$.subscribe((response) => {
      this.completedTransfers.set(response.items);

      if (response.paging_info.total_items <= this.page() * 5) {
        this.noNextPage.set(true);
      } else {
        this.noNextPage.set(false);
      }

      this.isLoading.set(false);
    });

    this.accountsService.account$
      .pipe(takeUntilDestroyed(), distinctUntilChanged())
      .subscribe(() => {
        this.isLoading.set(true);
      });
  }

  nextPage(): void {
    this.isLoading.set(true);
    this.page.update((page) => ++page);
    this.accountsService.setCompletedTransferPage(this.page());
  }

  previousPage(): void {
    this.isLoading.set(true);
    this.page.update((page) => --page);
    this.accountsService.setCompletedTransferPage(this.page());
  }
}
