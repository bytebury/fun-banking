import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../components/modal/modal.component';
import { AuthService } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

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

  constructor(
    private readonly auth: AuthService,
    private readonly user: UserService
  ) {}

  logout(): void {
    this.auth.logout();
  }

  openMobileNavigation(): void {
    this.mobileNavigationModal.open();
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.auth.isLoggedIn$;
  }

  get currentUser$(): Observable<User> {
    return this.user.currentUser$;
  }
}
