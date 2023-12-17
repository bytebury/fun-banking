import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BankService } from '../../../services/bank.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BannerComponent } from '../../../components/banner/banner.component';
import { Severity } from '../../../models/severity.enum';

@Component({
  selector: 'app-edit-bank',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBankComponent {
  readonly LETTERS_NUMBERS_AND_SPACES = /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/;

  errorMessage = signal<{
    exclamation: string;
    severity: Severity;
    message: string;
  }>({
    exclamation: '❌',
    severity: Severity.Default,
    message: '',
  });

  form = new FormGroup({
    name: new FormControl<string>('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern(this.LETTERS_NUMBERS_AND_SPACES),
      ],
    }),
    description: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  constructor(private readonly bankService: BankService) {
    this.bankService.bank$.pipe(takeUntilDestroyed()).subscribe((bank) => {
      this.form.get('name')?.setValue(bank?.name ?? '');
      this.form.get('description')?.setValue(bank?.description ?? '');
    });
  }

  updateBank(): void {
    this.bankService
      .update({
        name: this.form.get('name')?.value ?? '',
        description: this.form.get('description')?.value ?? '',
      })
      .subscribe({
        next: (bank) => {
          this.bankService.setBank(bank.id);
          this.errorMessage.set({
            exclamation: '✅',
            severity: Severity.Success,
            message: 'Successfully updated your bank.',
          });
          setTimeout(() => {
            this.errorMessage.update((value) => ({ ...value, message: '' }));
          }, 3_000);
        },
        error: (error) => {
          this.errorMessage.set({
            exclamation: '❌',
            severity: Severity.Default,
            message: error.error.message,
          });
        },
      });
  }
}
