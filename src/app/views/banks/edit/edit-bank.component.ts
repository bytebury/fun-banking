import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Bank } from '../../../models/bank.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-bank',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-bank.component.html',
  styleUrl: './edit-bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBankComponent implements OnChanges {
  @Input({ required: true }) bank: Bank | null = null;

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bank']?.currentValue) {
      this.form.get('name')?.setValue(this.bank?.name ?? '');
      this.form.get('description')?.setValue(this.bank?.description ?? '');
    }
  }

  updateBank(): void {
    // TODO: Need to call the backend
  }
}
