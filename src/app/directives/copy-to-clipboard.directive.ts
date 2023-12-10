import {
  Directive,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]',
  standalone: true,
})
export class CopyToClipboardDirective {
  @Input({ required: true }) value = '';
  @Output() copied = new EventEmitter<string>();

  @HostListener('click')
  async copyToClipboard(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.value);
      this.copied.emit(this.value);
    } catch (error) {
      console.error('Error copying text to clipboard:', error);
    }
  }
}
