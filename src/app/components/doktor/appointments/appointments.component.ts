import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import DoctorService from '../../../service/doctor-service/doctor-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments: any[] = [];
  doctorId: number | null = null;
  isLoading = false;

  constructor(
    private doktorService: DoctorService,
    private userService: UserService,
    private appointmentService: AppointmentService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        this.loadAppointments();
      },
      error: () => {
        this.toastr.error('Kullanıcı bilgisi alınamadı.');
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
      error: () => {
        this.toastr.error('Randevular alınamadı.');
        this.isLoading = false;
      }
    });
  }

  updateStatus(id: number, status: string): void {
    this.appointmentService.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        if (status === 'COMPLETED') {
          this.toastr.success('Muayene tamamlandı.');
        } else if (status === 'GEC_KALINDI') {
          this.toastr.info('Hasta geç kaldı olarak işaretlendi.');
        } else if (status === 'AKTIF') {
          this.toastr.info('Hasta tekrar aktif duruma alındı.');
        }
        this.loadAppointments();
      },
      error: () => {
        this.toastr.error('Randevu durumu güncellenemedi.');
      }
    });
  }

  markAsCompleted(id: number): void {
    this.updateStatus(id, 'COMPLETED');
  }

  markAsLate(id: number): void {
    this.updateStatus(id, 'GEC_KALINDI');
  }

  markAsActive(id: number): void {
    this.updateStatus(id, 'AKTIF');
  }

  goToExaminationForPatient(patientId: number): void {
    if (!patientId) {
      this.toastr.warning('Hasta bilgisi bulunamadı.');
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (doctor) => {
        this.appointmentService.getAppointmentsByDoctorId(doctor.id).subscribe({
          next: (appointments) => {
            const activeAppointment = appointments.find(
              (a: any) => a.patient?.id === patientId && a.status === 'AKTIF'
            );

            if (activeAppointment) {
              this.router.navigate(['/examination', activeAppointment.id]);
            } else {
              this.toastr.warning('Bu hastanın aktif randevusu bulunmamaktadır.');
            }
          },
          error: () => {
            this.toastr.error('Randevular alınırken hata oluştu.');
          }
        });
      },
      error: () => {
        this.toastr.error('Doktor bilgisi alınamadı.');
      }
    });
  }
}
