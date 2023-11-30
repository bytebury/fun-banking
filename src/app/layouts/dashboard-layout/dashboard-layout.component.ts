import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { CardComponent } from '../../components/card/card.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    CardComponent,
    TimelineComponent,
    RouterModule,
  ],
})
export class DashboardLayoutComponent {}
