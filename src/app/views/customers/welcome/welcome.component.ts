import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CustomerAuthService } from '../../../services/customer-auth.service';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { Customer } from '../../../models/customer.model';
import { MoneyTransferFormComponent } from '../money-transfer-form/money-transfer-form.component';
import { ShowAccountComponent } from '../../accounts/show/show-account.component';
import { AccountsService } from '../../../services/accounts.service';
import { BankAccount } from '../../../models/bank-account.model';
import { FooterComponent } from '../../../layouts/components/footer/footer.component';
import { AccountInsightsComponent } from '../../accounts/account-insights/account-insights.component';
import { RecentTransactionsComponent } from '../../accounts/recent-transactions/recent-transactions.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MoneyTransferFormComponent,
    ShowAccountComponent,
    FooterComponent,
    AccountInsightsComponent,
    RecentTransactionsComponent,
  ],
})
export class WelcomeComponent {
  customer = signal<Customer | null>(null);
  account = signal<BankAccount | null>(null);

  constructor(
    private readonly customerAuth: CustomerAuthService,
    private readonly accountsService: AccountsService
  ) {
    this.customerAuth.customer$.pipe(filter(Boolean)).subscribe((customer) => {
      this.customer.set(customer);
    });

    this.accountsService.accounts$
      .pipe(filter((accounts) => accounts.length > 0))
      .subscribe((accounts) => {
        this.account.set(accounts.at(0) ?? null);
        this.accountsService.getAccountInfo(this.account()?.id ?? 0);
      });
  }

  signout(): void {
    this.customerAuth.logout();
  }
}
