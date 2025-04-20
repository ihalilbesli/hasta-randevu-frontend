import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css'
})
export class AppointmentListComponent implements OnInit {
  allAppointments: any[] = [];
  filteredAppointments: any[] = [];

  filterOption: string = 'ALL'; // ALL | ACTIVE | CANCELED | LAST_7_DAYS | LAST_30_DAYS
  startDate: string = '';
  endDate: string = '';
  patientId: number | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.loadAppointments();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }

  loadAppointments(): void {
    if (!this.patientId) return;

    this.appointmentService.getAppointmentsByPatientId(this.patientId).subscribe({
      next: (appointments) => {
        this.allAppointments = appointments.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.applyFilter();
      },
      error: (err) => console.error('Randevular alınamadı:', err)
    });
  }

  isWithinLastDays(dateStr: string, days: number): boolean {
    const today = new Date();
    const date = new Date(dateStr);
    const diff = (today.getTime() - date.getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= days;
  }

  applyFilter(): void {
    let result = [...this.allAppointments];

    switch (this.filterOption) {
      case 'ACTIVE':
        result = result.filter(a => a.status === 'AKTIF');
        break;
      case 'CANCELED':
        result = result.filter(a => a.status === 'IPTAL_EDILDI');
        break;
      case 'LAST_7_DAYS':
        result = result.filter(a => this.isWithinLastDays(a.date, 7));
        break;
      case 'LAST_30_DAYS':
        result = result.filter(a => this.isWithinLastDays(a.date, 30));
        break;
    }

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      result = result.filter(a => {
        const date = new Date(a.date);
        return date >= start && date <= end;
      });
    }

    this.filteredAppointments = result;
  }

  cancelAppointment(id: number): void {
    if (!confirm('Bu randevuyu iptal etmek istiyor musunuz?')) return;

    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        alert('Randevu iptal edildi.');
        this.loadAppointments();
      },
      error: (err) => console.error('İptal hatası:', err)
    });
  }
}
