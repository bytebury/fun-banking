import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-new-bank',
  standalone: true,
  templateUrl: './new-bank.component.html',
  styleUrl: './new-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, SecuredLayoutComponent],
})
export class NewBankComponent {
  readonly LETTERS_NUMBERS_AND_SPACES = /^[A-Za-z0-9]+(?:\s[A-Za-z0-9]+)*$/;

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

  createBank(): void {
    // TODO create the bank
  }
}
