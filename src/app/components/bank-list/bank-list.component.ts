import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BankService } from '../../services/bank.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bank-list.component.html',
  styleUrl: './bank-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BankListComponent {
  banks$ = this.bank.banks$;
  isLoading$ = this.bank.isLoading$;

  constructor(private bank: BankService) {}
}
