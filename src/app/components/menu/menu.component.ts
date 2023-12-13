import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  @ViewChild('menuRef') menuRef!: ElementRef;

  showMenu = signal(false);

  private handleDismissFn = this.handleDismiss.bind(this);

  toggle(): void {
    this.showMenu.update((value) => !value);

    if (this.showMenu()) {
      document.addEventListener('click', this.handleDismissFn);
    } else {
      document.removeEventListener('click', this.handleDismissFn);
    }
  }

  handleDismiss(event: any): void {
    if (!this.menuRef.nativeElement.contains(event.target)) {
      this.toggle();
    }
  }
}
