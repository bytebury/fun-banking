import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ResourceLayoutComponent } from '../../../layouts/resource-layout/resource-layout.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BankService } from '../../../services/bank.service';
import { Observable, of } from 'rxjs';
import { Bank } from '../../../models/bank.model';

@Component({
  selector: 'app-bank',
  standalone: true,
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ResourceLayoutComponent, RouterModule],
})
export class BankComponent {
  bank$: Observable<Bank | undefined> = of();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bankService: BankService
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.bank$ = this.bankService.getBank(params.get('id')!);
    });
  }
}
