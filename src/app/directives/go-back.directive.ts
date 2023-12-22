import { Directive, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Directive({
  selector: '[appGoBack]',
  standalone: true,
})
export class GoBackDirective {
  constructor(private location: Location, private readonly router: Router) {}

  @HostListener('click')
  goBack(): void {
    const navigationState = this.location.getState() as any;

    if (!navigationState || navigationState.navigationId === 1) {
      this.router.navigate(['/']);
    } else {
      this.location.back();
    }
  }
}
