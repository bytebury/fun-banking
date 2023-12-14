import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Customer } from '../../../models/customer.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-edit-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-customer-form.component.html',
  styleUrl: './edit-customer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCustomerFormComponent implements OnChanges {
  readonly VALID_NAME = /^[A-Za-z]+$/;
  readonly VALID_PIN = /^\d{4,6}$/;

  @Input({ required: true }) customer: Customer | null = null;
  @Output() saved = new EventEmitter<Customer>();

  form: FormGroup = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern(this.VALID_NAME),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
      Validators.pattern(this.VALID_NAME),
    ]),
    pin: new FormControl('', [
      Validators.required,
      Validators.pattern(this.VALID_PIN),
    ]),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'].currentValue) {
      this.form.get('first_name')?.patchValue(this.customer?.first_name);
      this.form.get('last_name')?.patchValue(this.customer?.last_name);
      this.form.get('pin')?.patchValue(this.customer?.pin);
    }
  }

  submit(): void {
    if (this.form.valid && this.customer) {
      this.saved.emit({
        ...this.customer,
        first_name: this.form.get('first_name')?.value,
        last_name: this.form.get('last_name')?.value,
        pin: this.form.get('pin')?.value,
      });
    }
  }
}
