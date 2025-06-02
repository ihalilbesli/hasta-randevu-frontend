import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { ToastrService } from 'ngx-toastr';


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
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

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

    // Gizlilik kutusu kontrolü
    if (!this.privacyAccepted) {
      this.toastr.warning('Lütfen üyelik ve gizlilik politikasını onaylayınız.', 'Uyarı');
      return;
    }

    // Boş alan kontrolleri
    if (!this.name.trim() || !this.surname.trim() || !this.email.trim() || !this.password.trim()
      || !this.phoneNumber.trim() || !this.birthDate.trim() || this.gender === 'BELIRTILMEMIS') {
      this.toastr.warning('Lütfen tüm zorunlu alanları eksiksiz doldurunuz.', 'Eksik Bilgi');
      return;
    }
    // E-posta geçerliliği kontrolü
    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.toastr.warning('Lütfen geçerli bir e-posta adresi giriniz.', 'Hatalı E-posta');
      return;
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
        this.toastr.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...', 'Başarılı');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Kayıt başarısız:', err);
        this.toastr.error('Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.', 'Hata');
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
