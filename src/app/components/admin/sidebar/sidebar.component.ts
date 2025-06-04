import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  exportOpen = false;
  analyticsOpen = false;

  constructor(private router: Router) { }

  toggleExport() {
    this.exportOpen = !this.exportOpen;
    if (this.exportOpen) {
      this.analyticsOpen = false;
    }
  }

  toggleAnalytics() {
    this.analyticsOpen = !this.analyticsOpen;
    if (this.analyticsOpen) {
      this.exportOpen = false;
    }
  }
  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
