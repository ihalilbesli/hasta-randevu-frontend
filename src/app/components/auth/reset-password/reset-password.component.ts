import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email = '';
  name = '';
  surname = '';
  birthDate = '';
  newPassword = '';
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    const payload = {
      email: this.email,
      name: this.name,
      surname: this.surname,
      birthDate: this.birthDate,
      newPassword: this.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res: string) => {
        this.toastr.success(res, 'Başarılı');
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        const message = err?.error || 'Şifre sıfırlama başarısız.';
        this.toastr.error(message, 'Hata');
      }
    });
  }
}
