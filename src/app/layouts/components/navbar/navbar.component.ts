import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../components/modal/modal.component';
import { UserAuthenticationService } from '../../../services/user-authentication.service';

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

  constructor(private auth: UserAuthenticationService) {}

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
  }

  openMobileNavigation(): void {
    this.mobileNavigationModal.open();
  }
}
