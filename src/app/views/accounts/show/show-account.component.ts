import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccountsComponent } from '../index/accounts.component';
import { AccountsService } from '../../../services/accounts.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BankAccount } from '../../../models/bank-account.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';

@Component({
  selector: 'app-show-account',
  standalone: true,
  imports: [CommonModule, SecuredLayoutComponent],
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAccountComponent {
  account$ = of<BankAccount>({} as BankAccount);

  constructor(
    private readonly accountsService: AccountsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const accountId = params.get('id') as string;
        this.account$ = this.accountsService.getAccount(accountId);
      });
  }
}
