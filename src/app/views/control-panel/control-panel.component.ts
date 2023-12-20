import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavbarComponent } from '../../layouts/components/navbar/navbar.component';
import { FooterComponent } from '../../layouts/components/footer/footer.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-control-panel',
  standalone: true,
  templateUrl: './control-panel.component.html',
  styleUrl: './control-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NavbarComponent, FooterComponent, RouterModule],
})
export class ControlPanelComponent {}
