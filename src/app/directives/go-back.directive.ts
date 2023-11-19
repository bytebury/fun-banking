import { Directive, ElementRef, HostListener } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
  selector: '[appGoBack]',
  standalone: true,
})
export class GoBackDirective {
  constructor(private location: Location, private elementRef: ElementRef) {
    const navigationState = this.location.getState() as any;

    // This means that you have nowhere to go back to, so we shouldn't display it.
    if (!navigationState || navigationState.navigationId === 1) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }

  @HostListener('click')
  goBack(): void {
    this.location.back();
  }
}
