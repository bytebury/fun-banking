import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { first } from 'rxjs';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../../../models/customer.model';
import { BannerComponent } from '../../../components/banner/banner.component';
import { PopoverDirective } from '../../../directives/popover.directive';

@Component({
  selector: 'app-new-customer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SecuredLayoutComponent,
    BannerComponent,
    PopoverDirective,
  ],
  templateUrl: './new-customer.component.html',
  styleUrl: './new-customer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewCustomerComponent {
  readonly VALID_NAME = /^[a-zA-Z]+(?:-[a-zA-Z]+)?(?:'[a-zA-Z]+)?$/;
  readonly VALID_PIN = /^\d{4,6}$/;

  bankId = '';

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

  errorMessage = signal('');

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly customerService: CustomerService,
    private readonly router: Router
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        this.bankId = params.get('id')!;
      });
  }

  createCustomer(): void {
    if (this.form.valid) {
      this.customerService
        .create({
          bank_id: Number(this.bankId),
          first_name: this.form.get('first_name')?.value,
          last_name: this.form.get('last_name')?.value,
          pin: this.form.get('pin')?.value,
        })
        .pipe(first())
        .subscribe({
          next: (customer: Customer) => {
            this.router.navigate(['/', 'banks', customer.bank_id]);
          },
          error: (error) => {
            this.errorMessage.set(error.error.message);
          },
        });
    }
  }
}
