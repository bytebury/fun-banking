import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { RouterModule } from '@angular/router';
import { AccountsComponent } from '../../accounts/index/accounts.component';

@Component({
  selector: 'app-show-customer',
  standalone: true,
  imports: [CommonModule, RouterModule, AccountsComponent],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowCustomerComponent {
  @Input({ required: true }) customer: Customer | null = null;
  @Output() openedAccount = new EventEmitter<number>();
}
