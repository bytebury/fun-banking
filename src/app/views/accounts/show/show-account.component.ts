import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BankAccount } from '../../../models/bank-account.model';
import { BannerComponent } from '../../../components/banner/banner.component';

@Component({
  selector: 'app-show-account',
  standalone: true,
  imports: [CommonModule, BannerComponent],
  templateUrl: './show-account.component.html',
  styleUrl: './show-account.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowAccountComponent {
  @Input({ required: true }) account: BankAccount | null = null;
}
