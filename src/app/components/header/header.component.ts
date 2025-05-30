import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { UserService } from '../../service/user-service/user-service.service';
import { AuthService } from '../../service/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser: any;
  showMenu = false;
  currentTime: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.userService.getCurrentUser().subscribe({
      next: (user) => this.currentUser = user,
      error: () => this.currentUser = null
    });
  }
    ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
  }

  goToProfile(tab: string = 'identity') {
  this.router.navigate(['/profil'], { queryParams: { tab } });
}
  navigateHome() {
    const token = this.authService.getToken();
    if (token) {
      const role = this.authService.getUserRole();
      if (role === 'HASTA') {
        this.router.navigate(['/hasta-dashboard']);
      } else if (role === 'DOKTOR') {
        this.router.navigate(['/doktor-dashboard']);
      } else if (role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        this.router.navigate(['/welcome']);
      }
    } else {
      this.router.navigate(['/welcome']);
    }
  }
  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleString('tr-TR', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}
