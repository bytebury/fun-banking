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
import { Bank } from '../../../models/bank.model';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { first } from 'rxjs';
import { PopoverDirective } from '../../../directives/popover.directive';
import { NamePipe } from '../../../pipes/name.pipe';

@Component({
  selector: 'app-edit-bank',
  standalone: true,
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BannerComponent,
    PopoverDirective,
    NamePipe,
  ],
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

  employeeForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  bank = signal<Bank | null>(null);

  employees$ = this.employeeService.employees$;

  message = signal('');

  constructor(
    private readonly bankService: BankService,
    private readonly router: Router,
    private readonly employeeService: EmployeeService
  ) {
    this.bankService.bank$.pipe(takeUntilDestroyed()).subscribe((bank) => {
      this.form.get('name')?.setValue(bank?.name ?? '');
      this.form.get('description')?.setValue(bank?.description ?? '');
      this.bank.set(bank);
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
          }, 5_000);
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

  destroy(): void {
    if (
      confirm(
        'Are you sure you wish to delete this bank? You will not be able to undo this action.'
      )
    ) {
      this.bankService.destroy(Number(this.bank()?.id)).subscribe(() => {
        this.router.navigate(['/', 'dashboard']);
      });
    }
  }

  addEmployee(): void {
    this.employeeService
      .create({
        email: this.employeeForm.get('email')?.value ?? '',
        bank_id: this.bank()?.id ?? 0,
      })
      .pipe(first())
      .subscribe({
        next: () => {
          this.bankService.reload();
          this.message.set('');
        },
        error: (error) => {
          this.message.set(error.error.message);
        },
      });
  }
}
