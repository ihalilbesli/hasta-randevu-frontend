import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService) { }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  onSubmit() {
    if (!this.email.trim() || !this.password.trim()) {
      if (!this.email.trim() && !this.password.trim()) {
        this.toastr.warning('Lütfen email ve şifre bilgilerinizi giriniz.', 'Eksik Bilgi');
      } else if (!this.email.trim()) {
        this.toastr.warning('Lütfen email adresinizi giriniz.', 'Eksik Bilgi');
      } else {
        this.toastr.warning('Lütfen şifrenizi giriniz.', 'Eksik Bilgi');
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.toastr.warning('Lütfen geçerli bir e-posta adresi giriniz.', 'Hatalı E-posta');
      return;
    }


    this.authService.login(this.email, this.password).subscribe({
      next: (response: any) => {
        const token = response.token;
        localStorage.setItem('jwtToken', token);
        const decoded = this.authService.decodeToken(token);
        localStorage.setItem('userRole', decoded?.role || "");

        this.toastr.success('Giriş başarılı!', 'Başarılı');

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
        this.toastr.error('Giriş başarısız! Lütfen email ve şifrenizi kontrol edin.', 'Hata');
      }
    });
  }

  goToResetPassword() {
    this.router.navigate(['/reset-password']);
  }
}
