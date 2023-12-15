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
  selector: 'app-money-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SecuredLayoutComponent],
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoneyTransferComponent {
  form = new FormGroup({
    amount: new FormControl('', {
      updateOn: 'blur',
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(10_000),
      ],
    }),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  deposit(): void {
    console.log('deposit cash');
  }

  withdraw(): void {
    console.log('withdraw cash');
  }
}
