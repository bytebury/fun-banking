import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoBackDirective } from '../../directives/go-back.directive';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secured-layout',
  standalone: true,
  imports: [CommonModule, GoBackDirective, RouterModule],
  templateUrl: './secured-layout.component.html',
  styleUrls: ['./secured-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuredLayoutComponent {}
