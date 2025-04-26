import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword: boolean = false;
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        const decoded = this.authService.decodeToken(token);
        localStorage.setItem('userRole', decoded?.role || "");

        if (decoded?.role === "HASTA") {
          this.router.navigate(['/hasta-dashboard']);
        } else if (decoded?.role === 'DOKTOR') {
          this.router.navigate(['/doktor-dashboard']);
        } else if (decoded?.role === 'ADMIN') {
          this.router.navigate(['/admin-dashboard']);
        }
      },
      error: (err) => {
        console.error('Giriş başarısız:', err);
        alert('Giriş başarısız! Lütfen email ve şifrenizi kontrol edin.');
      }
    });
  }
}
