import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
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

  isModalOpen = signal(false);

  dismiss(event: any): void {
    if (!this.modal.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  close(): void {
    this.isModalOpen.set(false);
  }

  open(): void {
    this.isModalOpen.set(true);
  }
}
