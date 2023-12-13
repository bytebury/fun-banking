import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  ViewChild,
  signal,
} from '@angular/core';
import { ResourceLayoutComponent } from '../../../layouts/resource-layout/resource-layout.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { Observable, of } from 'rxjs';
import { Bank } from '../../../models/bank.model';
import { CopyToClipboardDirective } from '../../../directives/copy-to-clipboard.directive';
import { Tab, TabsComponent } from '../../../components/tabs/tabs.component';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { MenuComponent } from '../../../components/menu/menu.component';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-bank',
  standalone: true,
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ResourceLayoutComponent,
    RouterModule,
    CopyToClipboardDirective,
    TabsComponent,
    MenuComponent,
    ModalComponent,
  ],
})
export class BankComponent implements AfterViewInit {
  @ViewChild('customersTitle') customersTitle!: TemplateRef<unknown>;
  @ViewChild('customersContent') customersContent!: TemplateRef<unknown>;
  @ViewChild('settingsTitle') settingsTitle!: TemplateRef<unknown>;
  @ViewChild('settingsContent') settingsContent!: TemplateRef<unknown>;
  @ViewChild('insightsTitle') insightsTitle!: TemplateRef<unknown>;
  @ViewChild('insightsContent') insightsContent!: TemplateRef<unknown>;
  @ViewChild('editCustomerModal') editCustomerModal!: ModalComponent;

  bank$: Observable<Bank | undefined> = of();
  customers$: Observable<Customer[]> = of([]);
  hasCopiedBankUrl = signal(false);

  tabs = signal<Tab[]>([]);
  currentCustomer = signal<Customer | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bankService: BankService,
    private readonly customerService: CustomerService
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.bank$ = this.bankService.getBank(params.get('id')!);
      this.customers$ = this.customerService.getCustomers(params.get('id')!);
    });
  }

  openEditCustomer(customer: Customer): void {
    this.editCustomerModal.open();
    this.currentCustomer.set(customer);
  }

  copiedBankUrl(): void {
    this.hasCopiedBankUrl.set(true);
    setTimeout(() => {
      this.hasCopiedBankUrl.set(false);
    }, 3_000);
  }

  ngAfterViewInit(): void {
    this.tabs.set([
      {
        id: 'customers',
        title: this.customersTitle,
        content: this.customersContent,
      },
      {
        id: 'insights',
        title: this.insightsTitle,
        content: this.insightsContent,
      },
      {
        id: 'settings',
        title: this.settingsTitle,
        content: this.settingsContent,
      },
    ]);
  }
}
