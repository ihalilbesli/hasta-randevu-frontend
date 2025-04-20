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

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
  }

  goToProfile() {
    alert('Profil sayfası daha sonra eklenecek.');
  }
}
