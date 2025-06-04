import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/header/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'hasta-randevu-frontend';
  isPublicPage = true;
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const hiddenLayouts = ['login', 'register', 'welcome', 'reset-password', 'admin'];
        this.isPublicPage = !hiddenLayouts.some(p => this.router.url.includes(p));
      });
  }
}
