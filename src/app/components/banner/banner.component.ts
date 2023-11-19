import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export enum BannerVariety {
  Default = 'default',
  Danger = 'danger',
  Success = 'success',
  Warning = 'warning',
  Info = 'info',
}

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerComponent {
  @Input() exclamation = '🚀';
  @Input() variety = BannerVariety.Default;
}
