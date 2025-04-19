import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { UserService } from '../../../service/user-service/user-service.service';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent {
  allAppointments: any[] = [];
  filteredAppointments: any[] = [];
  filterOption: string = 'ALL'; // ALL | AKTIF | IPTAL_EDILMIS | LAST_7_DAYS | LAST_30_DAYS
  statusFilter: string = 'ALL';
  startDate: string = '';
  endDate: string = ''

  patientId: number | null = null;


  constructor(
    private appointmentService: 
    AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.GetAppointments();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }
  GetAppointments(): void {
    if (!this.patientId) return;

    this.appointmentService.getAppointmentsByPatientId(this.patientId).subscribe({
      next: (appointments) => {
        this.allAppointments = appointments;
        this.applyFilter();
      },
      error: (err) => console.error('Randevular alınamadı:', err)
    });
  }
  
  applyFilter(): void {
    const now = new Date();
    const today = new Date(now.toISOString().split('T')[0]);

    this.filteredAppointments = this.allAppointments.filter(a => {
      const appointmentDate = new Date(a.date);

      switch (this.filterOption) {
        case 'ACTIVE':
          return a.status === 'AKTIF';
        case 'CANCELED':
          return a.status === 'IPTAL_EDILDI';
        case 'LAST_7_DAYS':
          return (today.getTime() - appointmentDate.getTime()) / (1000 * 3600 * 24) <= 7;
        case 'LAST_30_DAYS':
          return (today.getTime() - appointmentDate.getTime()) / (1000 * 3600 * 24) <= 30;
        default:
          return true;
      }
    });
  }
  cancelAppointment(id: number): void {
    const confirmCancel = confirm('Bu randevuyu iptal etmek istiyor musunuz?');
    if (!confirmCancel) return;

    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        alert('Randevu iptal edildi.');
        this.GetAppointments();
      },
      error: (err) => console.error('İptal hatası:', err)
    });
  }
}

