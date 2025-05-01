import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  today: string = new Date().toISOString().split('T')[0];

  // Zorunlu alanlar
  name = '';
  surname = '';
  email = '';
  password = '';
  phoneNumber = '';
  gender: 'ERKEK' | 'KADIN' | 'BELIRTILMEMIS' = 'BELIRTILMEMIS';
  birthDate = '';



  // Gizlilik politikası
  privacyAccepted: boolean = false;
  submitted: boolean = false;
  showPrivacy: boolean = false;

  onSubmit() {
    this.submitted = true;

    if (!this.privacyAccepted) {
      return; // Gizlilik onayı yapılmadıysa devam etme
    }

    const userData = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birthDate: this.birthDate,
  
    };

    this.authService.register(userData).subscribe({
      next: () => {
        alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Kayıt başarısız:', err);
        alert('Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.');
      },
    });
  }

  openPrivacyPolicy(event: Event) {
    event.preventDefault();
    this.showPrivacy = true;
  }

  closePrivacyPolicy() {
    this.showPrivacy = false;
    this.privacyAccepted = true
  }
}
