import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { Customer } from '../../../models/customer.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { first } from 'rxjs';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-edit-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BannerComponent],
  templateUrl: './edit-customer-form.component.html',
  styleUrl: './edit-customer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditCustomerFormComponent implements OnChanges {
  readonly VALID_NAME = /^[A-Za-z]+$/;
  readonly VALID_PIN = /^\d{4,6}$/;

  @Input({ required: true }) customer: Customer | null = null;
  @Output() saved = new EventEmitter<Customer>();

  errorMessage = signal('');

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

  constructor(private readonly customerService: CustomerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'].currentValue) {
      this.form.get('first_name')?.patchValue(this.customer?.first_name);
      this.form.get('last_name')?.patchValue(this.customer?.last_name);
      this.form.get('pin')?.patchValue(this.customer?.pin);
    }
  }

  submit(): void {
    if (this.form.valid && this.customer) {
      this.customerService
        .update(this.customer.id, {
          first_name: this.form.get('first_name')?.value,
          last_name: this.form.get('last_name')?.value,
          pin: this.form.get('pin')?.value,
        })
        .pipe(first())
        .subscribe({
          next: (customer) => {
            this.saved.emit(customer);
          },
          error: (error) => {
            this.errorMessage.set(error.error.message);
          },
        });
    }
  }
}
