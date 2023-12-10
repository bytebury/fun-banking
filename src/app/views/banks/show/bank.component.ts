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
  ],
})
export class BankComponent implements AfterViewInit {
  @ViewChild('customersTitle') customersTitle!: TemplateRef<unknown>;
  @ViewChild('customersContent') customersContent!: TemplateRef<unknown>;
  @ViewChild('settingsTitle') settingsTitle!: TemplateRef<unknown>;
  @ViewChild('settingsContent') settingsContent!: TemplateRef<unknown>;
  @ViewChild('insightsTitle') insightsTitle!: TemplateRef<unknown>;
  @ViewChild('insightsContent') insightsContent!: TemplateRef<unknown>;

  bank$: Observable<Bank | undefined> = of();
  hasCopiedBankUrl = signal(false);

  tabs = signal<Tab[]>([]);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bankService: BankService
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.bank$ = this.bankService.getBank(params.get('id')!);
    });
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
        id: 'settings',
        title: this.settingsTitle,
        content: this.settingsContent,
      },
      {
        id: 'insights',
        title: this.insightsTitle,
        content: this.insightsContent,
      },
    ]);
  }
}
