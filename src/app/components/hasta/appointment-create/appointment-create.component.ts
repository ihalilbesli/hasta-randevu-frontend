import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CLINICS } from '../../../data/clinics';
import { UserService } from '../../../service/user-service/user-service.service';
import { AuthService } from '../../../service/auth/auth.service';
import { AppointmentService } from '../../../service/appoinment/appointment.service';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent implements OnInit {
  clinics: string[] = CLINICS;
  doctors: any[] = [];
  timeSlots: string[] = [];
  groupedTimeSlots: { hour: string, slots: string[] }[] = [];

  minDate = new Date().toISOString().split('T')[0];
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0];
  invalidDate = false;

  selectedClinic: string = '';
  selectedDoctorId: number | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  patientId: number | null = null;
  existingAppointments: any[] = [];
  description:string="";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
      },
      error: (err) => {
        console.error('Kullanci alinamadi:', err);
      }
    });
  }

  onClinicChange() {
    this.userService.getUsersBySpecialization(this.selectedClinic).subscribe({
      next: (data) => {
        this.doctors = data;
      },
      error: (err) => {
        console.error('Doktorlar alinamadi:', err);
      }
    });
  }

  onDateChange(event: any) {
    const selected = new Date(event.target.value);
    const day = selected.getDay(); // 0 = Pazar, 6 = Cumartesi
    this.invalidDate = (day === 0 || day === 6);

    if (this.invalidDate) {
      this.groupedTimeSlots = [];
      this.selectedTime = '';
      return;
    }

    if (this.selectedDoctorId) {
      this.appointmentService.getAppointmentsByDoctorAndDate(this.selectedDoctorId, this.selectedDate).subscribe({
        next: (appointments) => {
          this.existingAppointments = appointments;
          this.generateTimeSlots();
        },
        error: (err) => {
          console.error('Doktorun randevulari alinamadi:', err); //
        }
      });
    }
  }

  generateTimeSlots() {
    const startHour = 8;
    const endHour = 17;
    const interval = 20;

    this.groupedTimeSlots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      const slots: string[] = [];
      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
      this.groupedTimeSlots.push({ hour: `${hour}:00`, slots });
    }
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  onSubmit() {
    if (!this.patientId || !this.selectedDoctorId || !this.selectedTime || !this.selectedDate) return;

    const appointmentData = {
      clinic: this.selectedClinic,
      date: this.selectedDate,
      time: this.selectedTime,
      description: this.description||"Online randevu alındı.",
      doctor: { id: this.selectedDoctorId },
      patient: { id: this.patientId }
    };

    this.appointmentService.createAppointment(appointmentData).subscribe({
      next: () => {
        alert('Randevu başariyla oluşturuldu!');
        this.resetForm();
      },
      error: (err) => {
        console.error('Randevu sirasinda hata oluştu:', err);
        alert('Randevu oluşturulamadi.');
      }
    });
  }

  resetForm() {
    this.selectedClinic = '';
    this.selectedDoctorId = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.doctors = [];
    this.existingAppointments = [];
    this.groupedTimeSlots = [];
    this.invalidDate = false;
    this.description="";
  }

  isTimeTaken(time: string): boolean {
    return this.existingAppointments.some(
      a => a.time?.substring(0, 5) === time
    );
  }
}
