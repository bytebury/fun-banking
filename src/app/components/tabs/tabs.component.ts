import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

export interface Tab {
  id: string;
  title: TemplateRef<unknown>;
  content: TemplateRef<unknown>;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
  @Input() activeTab = signal(0);
  @Input({ required: true }) tabs = signal<Tab[]>([]);
  @Output() selected = new EventEmitter<Tab>();

  constructor(private router: Router) {}

  setActiveTab(index: number): void {
    this.activeTab.set(index);
    this.selected.emit(this.tabs()[index]);
    this.router.navigate([window.location.pathname], {
      queryParams: {
        tab: this.tabs().at(this.activeTab())?.id,
      },
    });
  }
}
