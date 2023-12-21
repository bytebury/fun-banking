import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FooterComponent } from '../../../layouts/components/footer/footer.component';
import { NavbarComponent } from '../../../layouts/components/navbar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FooterComponent, NavbarComponent, RouterModule],
})
export class AnnouncementLayoutComponent {}
