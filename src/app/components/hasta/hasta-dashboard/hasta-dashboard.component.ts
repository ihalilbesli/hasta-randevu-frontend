import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service.service';
import { AuthService } from '../../../service/auth/auth.service';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { HeaderComponent } from '../../header/header.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { PharmacySearchComponent } from '../pharmacy-search/pharmacy-search.component';


@Component({
  selector: 'app-hasta-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, AiChatComponent],
  templateUrl: './hasta-dashboard.component.html',
  styleUrl: './hasta-dashboard.component.css'
})
export class HastaDashboardComponent implements OnInit {
  currentUser: any;
  showMenu = false;
  activeTab: 'aktif' | 'gecmis' = 'aktif';
  activeAppointments: any[] = [];
  pastAppointments: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadAppointments(user.id);
      },
      error: (err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      }
    });
  }

  loadAppointments(patientId: number): void {
    console.log('loadAppointments çalıştı. Hasta ID:', patientId);

    this.appointmentService.getAppointmentsByPatientId(patientId).subscribe({
      next: (appointments) => {
        console.log('Tüm randevular:', appointments);

        this.activeAppointments = appointments.filter(app => app.status === 'AKTIF');
        console.log('Aktif Randevular:', this.activeAppointments);

        this.pastAppointments = appointments
          .filter(app => app.status === 'IPTAL_EDILDI')
          .sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateB.getTime() - dateA.getTime();
          });
        console.log('Geçmiş Randevular:', this.pastAppointments);
      },
      error: (err) => {
        console.error('Randevular alınamadı:', err);
      }
    });
  }


  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  goToActiveRandevular() {
    this.router.navigate(['/appointment-list'], {
      queryParams: { tab: 'ACTIVE' }
    });
  }

  goToGecmisRandevular() {
    this.router.navigate(['/appointment-list'], {
      queryParams: { tab: 'CANCELED' }
    });
  }
  cancelAppointment(appointmentId: number): void {
    const confirmed = window.confirm("Randevunuzu iptal etmek istediğinize emin misiniz?");
    if (!confirmed) return;

    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: () => {
        console.log('Randevu iptal edildi:', appointmentId);
        this.loadAppointments(this.currentUser.id);
      },
                            error: (err) => {
        console.error('İ  ptal hatası:',     err);
      }
    });
  }


}
