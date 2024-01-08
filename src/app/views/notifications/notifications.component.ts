import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../layouts/components/footer/footer.component';
import { NavbarComponent } from '../../layouts/components/navbar/navbar.component';
import { NotificationService } from '../../services/notification.service';
import { MoneyTransferService } from '../../services/money-transfer.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FooterComponent, NavbarComponent],
})
export class NotificationsComponent {
  notifications$ = this.notificationService.notifications$;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly moneyTransferService: MoneyTransferService
  ) {}

  approve(transferId: number): void {
    this.moneyTransferService.approve(transferId).subscribe(() => {
      this.notificationService.reload();
    });
  }

  decline(transferId: number): void {
    this.moneyTransferService.decline(transferId).subscribe(() => {
      this.notificationService.reload();
    });
  }
}
