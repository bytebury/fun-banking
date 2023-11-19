import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: 'navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ModalComponent],
})
export class NavbarComponent {
  @ViewChild('mobileNavigation') mobileNavigationModal!: ModalComponent;

  openMobileNavigation(): void {
    this.mobileNavigationModal.open();
  }
}
