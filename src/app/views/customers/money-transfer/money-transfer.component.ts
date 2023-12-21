import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SecuredLayoutComponent } from '../../../layouts/secured-layout/secured-layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MoneyTransferFormComponent } from '../money-transfer-form/money-transfer-form.component';

@Component({
  selector: 'app-money-transfer',
  standalone: true,
  templateUrl: './money-transfer.component.html',
  styleUrl: './money-transfer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SecuredLayoutComponent,
    MoneyTransferFormComponent,
  ],
})
export class MoneyTransferComponent {}
