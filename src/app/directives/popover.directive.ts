import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPopover]',
  standalone: true,
})
export class PopoverDirective {
  @Input() appPopover = '';
  @Input() placement: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  private popoverElement: HTMLElement;

  constructor(private element: ElementRef<HTMLElement>) {
    this.popoverElement = document.createElement('div');
  }

  @HostListener('mouseover')
  hoverOver(): void {
    this.popoverElement.innerHTML = this.appPopover;
    this.element.nativeElement.classList.add('popover');
    this.element.nativeElement.appendChild(this.popoverElement);

    if (
      this.element.nativeElement.offsetLeft <
      this.popoverElement.clientWidth / 2
    ) {
      this.placement = 'right';
    } else {
      this.popoverElement.style.top =
        this.element.nativeElement.clientTop +
        this.element.nativeElement.clientHeight +
        6 +
        'px';
    }

    this.element.nativeElement.classList.add(this.placement);
  }

  @HostListener('mouseout')
  hoverOff(): void {
    this.element.nativeElement.removeChild(this.popoverElement);
  }
}
