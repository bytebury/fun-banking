import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @ViewChild('modal') modal!: ElementRef;

  constructor(private renderer: Renderer2) {}

  isModalOpen = signal(false);

  dismiss(event: any): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  close(): void {
    this.isModalOpen.set(false);
    this.renderer.setStyle(document.body, 'overflow', 'auto');
  }

  open(): void {
    this.isModalOpen.set(true);
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }
}
