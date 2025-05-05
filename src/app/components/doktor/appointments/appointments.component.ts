import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import DoctorService from '../../../service/doctor-service/doctor-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { AppointmentService } from '../../../service/appoinment/appointment.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent  {
  appointments: any[] = [];
  doctorId: number | null = null;
  isLoading = false;
  
   constructor(
    private doktorService: DoctorService,
    private userService: UserService,
    private appointmentService:AppointmentService
  ) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Kullanıcı alınamadı:', err);
        this.isLoading = false;
      }
    });
  }
  loadAppointments(): void {
    if (!this.doctorId) return;

    this.doktorService.getAppointmentsByDoctor(this.doctorId).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Randevular alınamadı:', err);
        this.isLoading = false;
      }
    });
  } 
  markAsCompleted(id: number) {
    this.appointmentService.updateAppointmentStatus(id, 'COMPLETED').subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Durum güncellenemedi:', err);
      }
    });
  }
  
  markAsLate(id: number) {
    this.appointmentService.updateAppointmentStatus(id, 'GEC_KALINDI').subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        console.error('Durum güncellenemedi:', err);
      }
    });
  }
  
  
}
