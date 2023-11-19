import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomepageLayoutComponent } from '../../layouts/homepage-layout/homepage-layout.component';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    HomepageLayoutComponent,
    BannerComponent,
  ],
})
export class HomepageComponent {}
