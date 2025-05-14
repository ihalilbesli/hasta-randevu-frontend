import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClinicsService } from '../../../service/clinics/clinics.service';


@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './admin-user-list.component.html',
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent {
  users: any[] = [];
  filteredUsers: any[] = [];

  selectedRole: string = 'HASTA';
  newUser: any = {};
  clinics: any[] = [];


  nameFilter: string = '';
  emailFilter: string = '';
  genderFilter: string = '';
  bloodTypeFilter: string = '';
  specializationFilter: string = '';

  showEditModal = false;
  editedUser: any = {};

  showNewUserForm = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private clinicService:ClinicsService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
     this.clinicService.getAllClinics().subscribe({
    next: (res) => this.clinics = res,
    error: () => console.error('Klinikler getirilemedi')
  });
  }

  selectRole(role: string) {
    this.selectedRole = role;

    // Formları kapat
    this.showEditModal = false;
    this.showNewUserForm = false;
  
    // Filtre alanlarını sıfırla
    this.nameFilter = '';
    this.emailFilter = '';
    this.genderFilter = '';
    this.bloodTypeFilter = '';
    this.specializationFilter = '';
    
    this.newUser = {};       // yeni kullanıcı formu da sıfırlansın
    this.editedUser = {}; 

    
    
  
    this.filterUsers(); // filtreyi yeniden uygula
  }

  goToUserDetails(id: number) {
    this.router.navigate([`/admin/users/${id}/details`]);
  }

  getAllUsers() {
    this.userService.getUsersByRole('HASTA').subscribe({
      next: (patients) => {
        this.userService.getUsersByRole('DOKTOR').subscribe({
          next: (doctors) => {
            this.userService.getUsersByRole('ADMIN').subscribe({
              next: (admins) => {
                this.users = [...patients, ...doctors, ...admins];
                this.filterUsers();
              },
              error: () => console.error('Adminler getirilemedi.')
            });
          },
          error: () => console.error('Doktorlar getirilemedi.')
        });
      },
      error: () => console.error('Hastalar getirilemedi.')
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user =>
      user.role === this.selectedRole &&
      user.name.toLowerCase().includes(this.nameFilter.toLowerCase()) &&
      user.email.toLowerCase().includes(this.emailFilter.toLowerCase()) &&
      (this.genderFilter === '' || user.gender === this.genderFilter) &&
      (this.bloodTypeFilter === '' || user.bloodType === this.bloodTypeFilter) &&
      (this.specializationFilter === '' || (user.specialization || '').toLowerCase().includes(this.specializationFilter.toLowerCase()))
    );
  }

  createUser() {
    this.newUser.role = this.selectedRole;

    this.userService.create(this.newUser).subscribe({
      next: (createdUser) => {
        this.users.push(createdUser);
        this.newUser = {};
        this.filterUsers();
        alert(`${this.selectedRole} başarıyla eklendi.`);
      },
      error: () => {
        alert('Kullanıcı eklenemedi.');
      }
    });
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
  this.showNewUserForm = false; 

  // Eğer doktor ise, kullanıcının mevcut clinic ID'sine göre clinic nesnesini bul
  let selectedClinic = null;
  if (user.role === 'DOKTOR' && user.clinic) {
    selectedClinic = this.clinics.find(c => c.id === user.clinic.id);
  }

  this.editedUser = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    birthDate: user.birthDate,
    gender: user.gender,
    role: user.role,
    bloodType: user.bloodType,
    chronicDiseases: user.chronicDiseases,
    specialization: user.specialization,
    clinic: selectedClinic || null
  };

  this.showEditModal = true;
}

  closeEditModal() {
    this.showEditModal = false;
    this.editedUser = {};
  }

  saveEditUser() {
    console.log('Güncellemeden önce editedUser:', this.editedUser);
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
  toggleNewUserForm() {
    this.showNewUserForm = !this.showNewUserForm;
    this.showEditModal = false; // güncelleme kapanır

  }
}
