import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../layouts/components/navbar/navbar.component';
import { FooterComponent } from '../../layouts/components/footer/footer.component';
import { GoBackDirective } from '../../directives/go-back.directive';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent, FooterComponent, GoBackDirective],
})
export class PageNotFoundComponent {}
