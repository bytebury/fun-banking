import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import { BankService } from '../../../services/bank.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BannerComponent } from '../../../components/banner/banner.component';
import { CustomerAuthService } from '../../../services/customer-auth.service';

@Component({
  selector: 'app-bank-signin',
  standalone: true,
  templateUrl: './bank-signin.component.html',
  styleUrl: './bank-signin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SecuredLayoutComponent,
    ReactiveFormsModule,
    BannerComponent,
  ],
})
export class BankSigninComponent {
  bank$ = this.bankService.bank$;
  bank = toSignal(this.bank$);
  errorMessage = this.customerAuth.errorMessage;

  form = new FormGroup({
    pin: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(6),
    ]),
  });

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly bankService: BankService,
    private readonly customerAuth: CustomerAuthService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const username = params.get('username') ?? '';
        const slug = params.get('slug') ?? '';

        this.bankService.findBankByUsernameAndSlug(username, slug);
        this.customerAuth.setCurrentBank({ username, slug });
      });
  }

  login(): void {
    this.customerAuth.signIn(
      this.bank()?.id.toString() ?? '',
      this.form.get('pin')?.value ?? ''
    );
  }
}
