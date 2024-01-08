import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BankAccount } from '../../../models/bank-account.model';
import { AccountsService } from '../../../services/accounts.service';
import { MoneyTransferService } from '../../../services/money-transfer.service';
import { Severity } from '../../../models/severity.enum';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-money-transfer-form',
  standalone: true,
  templateUrl: './money-transfer-form.component.html',
  styleUrl: './money-transfer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
})
export class MoneyTransferFormComponent {
  @Input() customerId = 0;

  form = new FormGroup({
    amount: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(250_000_000),
      ],
    }),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  account = signal<BankAccount | null>(null);

  message = signal<{
    message: string;
    exclamation: string;
    severity: Severity;
  } | null>(null);

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly accountsService: AccountsService,
    private readonly moneyTransferService: MoneyTransferService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const customerId = Number(params.get('id'));

        if (customerId) {
          accountsService.loadAccountsFor(customerId);
          this.customerId = customerId;
        }
      });

    this.accountsService.accounts$.subscribe((accounts) => {
      this.account.set(accounts.at(0) ?? null);
    });
  }

  ngOnInit(): void {
    if (this.customerId) {
      this.accountsService.loadAccountsFor(this.customerId);
    }
  }

  deposit(): void {
    if (this.account()?.id) {
      this.moneyTransferService
        .depositInto({
          amount: Number(this.form.get('amount')?.value),
          description: this.form.get('description')?.value ?? '',
          account_id: this.account()!.id,
        })
        .subscribe({
          next: () => {
            this.form.reset();
            this.message.set({
              message: 'Successfully submitted the deposit transfer',
              severity: Severity.Success,
              exclamation: '✅',
            });
            this.accountsService.loadAccountsFor(this.customerId);
          },
          error: (error) => {
            this.form.reset();
            this.message.set({
              message: error.error.message,
              severity: Severity.Default,
              exclamation: '❌',
            });
          },
        });
    }
  }

  withdraw(): void {
    if (this.account()?.id) {
      this.moneyTransferService
        .withdrawFrom({
          amount: Number(this.form.get('amount')?.value),
          description: this.form.get('description')?.value ?? '',
          account_id: this.account()!.id,
        })
        .subscribe({
          next: () => {
            this.form.reset();
            this.message.set({
              message: 'Successfully submitted the withdraw transfer',
              severity: Severity.Success,
              exclamation: '✅',
            });
            this.accountsService.loadAccountsFor(this.customerId);
          },
          error: (error) => {
            this.form.reset();
            this.message.set({
              message: error.error.message,
              severity: Severity.Default,
              exclamation: '❌',
            });
          },
        });
    }
  }
}
