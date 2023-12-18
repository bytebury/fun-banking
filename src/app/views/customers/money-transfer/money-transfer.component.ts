import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccountsService } from '../../../services/accounts.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BankAccount } from '../../../models/bank-account.model';
import { MoneyTransferService } from '../../../services/money-transfer.service';

@Component({
  selector: 'app-money-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SecuredLayoutComponent],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTransferComponent {
  form = new FormGroup({
    amount: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(10_000),
      ],
    }),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  account = signal<BankAccount | null>(null);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountsService: AccountsService,
    private readonly moneyTransferService: MoneyTransferService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const customerId = params.get('id');
        accountsService.loadAccountsFor(Number(customerId));
      });

    this.accountsService.accounts$.subscribe((accounts) => {
      this.account.set(accounts.at(0) ?? null);
    });
  }

  deposit(): void {
    if (this.account()?.id) {
      this.moneyTransferService.depositInto({
        amount: Number(this.form.get('amount')?.value),
        description: this.form.get('description')?.value ?? '',
        account_id: this.account()!.id,
      });
    }
  }

  withdraw(): void {
    if (this.account()?.id) {
      this.moneyTransferService.withdrawFrom({
        amount: Number(this.form.get('amount')?.value),
        description: this.form.get('description')?.value ?? '',
        account_id: this.account()!.id,
      });
    }
  }
}
