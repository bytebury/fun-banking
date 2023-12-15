import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../../../models/bank-account.model';
import { BannerComponent } from '../../../components/banner/banner.component';
import { Severity } from '../../../models/severity.enum';

@Component({
  selector: 'app-show-customer',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './show-customer.component.html',
  styleUrl: './show-customer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowCustomerComponent implements OnChanges {
  @Input({ required: true }) customer: Customer | null = null;
  bankAccounts$: Observable<BankAccount[]> = of([]);

  severity = Severity.Info;

  constructor(private readonly customerService: CustomerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['customer'] && this.customer) {
      this.bankAccounts$ = this.customerService.getBankAccounts(
        this.customer!.id
      );
    }
  }
}
