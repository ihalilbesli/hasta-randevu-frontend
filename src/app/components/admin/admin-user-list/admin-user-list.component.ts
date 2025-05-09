import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent {
  users: any[] = [];
  filteredUsers: any[] = [];
  nameFilter: string = '';
  emailFilter: string = '';
  showEditModal = false;
  editedUser: any = {};
  

  constructor(
    private userService: UserService,
    private router:Router
  ) {}


  ngOnInit(): void {
    this.getAllUsers();
  }
  goToUserDetails(id: number) {
    this.router.navigate([`/admin/users/${id}/details`]);
  }

  getAllUsers() {
    this.userService.getUsersByRole('HASTA').subscribe({
      next: (patients) => {
        this.userService.getUsersByRole('DOKTOR').subscribe({
          next: (doctors) => {
            this.users = [...patients, ...doctors];
            this.filteredUsers = this.users;
          },
          error: () => console.error('Doktorlar getirilemedi.')
        });
      },
      error: () => console.error('Hastalar getirilemedi.')
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
      u.email.toLowerCase().includes(this.emailFilter.toLowerCase())
    );
  }

  deleteUser(userId: number) {
    if (confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
      this.userService.deleteUserById(userId).subscribe({
        next: () => {
          alert('Kullanıcı başarıyla silindi.');
          this.users = this.users.filter(u => u.id !== userId);
          this.filterUsers(); 
        },
        error: (err) => {
          console.error('Silme hatası:', err);
          alert('Kullanıcı silinemedi.');
        }
      });
    }
  }
  updateUser(user: any) {
    this.openEditModal(user);
  }
  openEditModal(user: any) {
    this.editedUser = {  id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      birthDate: user.birthDate,
      gender: user.gender,
      role: user.role,
      bloodType: user.bloodType,
      chronicDiseases: user.chronicDiseases,
      specialization: user.specialization };
    this.showEditModal = true;
  }
  
  closeEditModal() {
    this.showEditModal = false;
    this.editedUser = {};
  }
  
  saveEditUser() {
    this.userService.updateUser(this.editedUser).subscribe({
      next: () => {
        alert('Kullanıcı güncellendi.');
        this.getAllUsers();
        this.closeEditModal();
      },
      error: () => {
        alert('Güncelleme başarısız.');
      }
    });
  }
  
}
