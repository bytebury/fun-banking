import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-resource-layout',
  standalone: true,
  templateUrl: './resource-layout.component.html',
  styleUrl: './resource-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent, FooterComponent],
})
export class ResourceLayoutComponent {}
