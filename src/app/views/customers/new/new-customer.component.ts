import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { take } from 'rxjs';
import { BankService } from '../../../services/bank.service';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SecuredLayoutComponent],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCustomerComponent {
  readonly VALID_NAME = /^[A-Za-z]+$/;
  readonly VALID_PIN = /^\d{4,6}$/;

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

  createCustomer(): void {
    if (this.form.valid) {
      this.customerService
        .createCustomer('1', {
          first_name: this.form.get('first_name')?.value,
          last_name: this.form.get('last_name')?.value,
          pin: this.form.get('pin')?.value,
          balance: 100,
        })
        .pipe(take(1))
        .subscribe((customer) => {
          console.log(customer);
        });
    }
  }
}
