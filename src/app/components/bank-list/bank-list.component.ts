import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class BankListComponent implements OnInit {
  banks$ = this.bankService.getBanks();

  constructor(private bankService: BankService) {}

  ngOnInit(): void {}
}
