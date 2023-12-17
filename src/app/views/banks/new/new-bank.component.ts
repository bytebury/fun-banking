import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BankService } from '../../../services/bank.service';
import { first } from 'rxjs';
import { BannerComponent } from '../../../components/banner/banner.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-bank',
  standalone: true,
  templateUrl: './new-bank.component.html',
  styleUrl: './new-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BannerComponent,
    SecuredLayoutComponent,
  ],
})
export class NewBankComponent {
  readonly LETTERS_NUMBERS_AND_SPACES = /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/;

  errorMessage = signal('');

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

  constructor(
    private readonly bank: BankService,
    private readonly router: Router
  ) {}

  createBank(): void {
    this.bank
      .create({
        name: this.form.get('name')?.value ?? '',
        description: this.form.get('description')?.value ?? '',
      })
      .pipe(first())
      .subscribe({
        next: (bank) => {
          this.errorMessage.set('');
          this.router.navigate(['/', 'banks', bank.id]);
        },
        error: (error) => {
          this.errorMessage.set(error.error.message);
        },
      });
  }
}
