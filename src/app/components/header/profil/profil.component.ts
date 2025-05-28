import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  showOldPassword = false;
showNewPassword = false;
showRepeatPassword = false;

  isEditingIdentity = false;
  isEditingContact = false;
  originalProfileData: any = {};

  profileData: any = {};
  activeTab: string = 'identity';
  oldPassword = '';
  newPassword = '';
  newPasswordRepeat = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.activeTab = params['tab'] || 'identity';
    });

    this.userService.getProfile().subscribe({
      next: (data) => {
        this.profileData = { ...data };
        this.originalProfileData = { ...data };
      },
      error: () => this.toastr.error('Profil bilgileri alınamadı.')
    });
  }

  saveIdentity(): void {
    this.userService.updateProfile(this.profileData).subscribe({
      next: () => {
        this.toastr.success('Kişisel bilgiler başarıyla güncellendi.');
        this.originalProfileData = { ...this.profileData };
        this.isEditingIdentity = false;
      },
      error: () => this.toastr.error('Kimlik bilgileri güncellenemedi.')
    });
  }

  saveContact(): void {
    this.userService.updateProfile(this.profileData).subscribe({
      next: () => {
        this.toastr.success('İletişim bilgileri başarıyla güncellendi.');
        this.originalProfileData = { ...this.profileData };
        this.isEditingContact = false;
      },
      error: () => this.toastr.error('İletişim bilgileri güncellenemedi.')
    });
  }

  changePassword(): void {
    if (this.newPassword !== this.newPasswordRepeat) {
      this.toastr.warning('Yeni parolalar uyuşmuyor.');
      return;
    }

    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        this.toastr.success(res.message || 'Parola başarıyla değiştirildi.');
      },
      error: (err) => {
        console.error('Password change error:', err);
        this.toastr.error('Parola değiştirme başarısız.');
      }
    });
  }

  cancelEdit(type: 'identity' | 'contact'): void {
    this.profileData = { ...this.originalProfileData };
    if (type === 'identity') this.isEditingIdentity = false;
    if (type === 'contact') this.isEditingContact = false;
  }
  togglePassword(field: 'old' | 'new' | 'repeat'): void {
  if (field === 'old') this.showOldPassword = !this.showOldPassword;
  if (field === 'new') this.showNewPassword = !this.showNewPassword;
  if (field === 'repeat') this.showRepeatPassword = !this.showRepeatPassword;
}
}
