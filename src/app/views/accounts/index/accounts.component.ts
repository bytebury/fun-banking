import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Severity } from '../../../models/severity.enum';
import { Customer } from '../../../models/customer.model';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent {
  @Input({ required: true }) customer: Customer | null = null;
  @Output() opened = new EventEmitter<number>();

  severity = Severity.Info;

  openAccount(accountId: number): void {
    this.opened.emit(accountId);
  }
}
