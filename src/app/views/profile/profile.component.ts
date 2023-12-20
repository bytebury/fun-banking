import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Observable, filter, of } from 'rxjs';
import { NavbarComponent } from '../../layouts/components/navbar/navbar.component';
import { FooterComponent } from '../../layouts/components/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  userRole = UserRole;
  user$: Observable<User | null> = of(null).pipe(filter(Boolean));

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService
  ) {
    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const username = params.get('username') ?? '';

        if (username === '') {
          this.user$ = this.userService.currentUser$;
        } else {
          this.user$ = this.userService.getUser$(username);
        }
      });
  }
}
