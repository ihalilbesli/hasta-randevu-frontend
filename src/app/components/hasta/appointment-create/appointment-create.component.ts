import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service.service';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { HeaderComponent } from '../../header/header.component';
import { ClinicsService } from '../../../service/clinics/clinics.service';



@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent implements OnInit {
  clinics: any[] = [];
  doctors: any[] = [];

  groupedTimeSlots: { hour: string, slots: string[] }[] = [];
  pastTimes: string[] = [];

  minDate = new Date().toISOString().split('T')[0];
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0];

  selectedClinicId: number | null = null;
  selectedDoctorId: number | null = null;
  selectedDate = '';
  selectedTime = '';
  patientId: number | null = null;

  allAppointments: any[] = [];
  doctorAppointments: any[] = [];

  description = '';
  invalidDate = false;
  openGroups: { [hour: string]: boolean } = {};


  constructor(
    private userService: UserService,
    private appointmentService: AppointmentService,
    private clinicService:ClinicsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clinicService.getAllClinics().subscribe({
      next: (data) => {
        this.clinics = data.filter(clinic => clinic.isActive); 

        this.route.queryParams.subscribe(params => {
          if (params["clinic"]) {
            const match = this.clinics.find(c => c.name === params["clinic"]);
            if (match) {
              this.selectedClinicId = match.id;
              this.onClinicChange();
            }
          }
        });
      },
      error: (err) => console.error('Klinikler alınamadı:', err)
    });

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }

  getPatientAppointments(patientId: number) {
    this.appointmentService.getAppointmentsByPatientId(patientId).subscribe({
      next: (data) => this.allAppointments = data,
      error: (err) => console.error('Hasta randevuları alınamadı:', err)
    });
  }

  resetSelections() {
    this.selectedDoctorId = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.groupedTimeSlots = [];
    this.doctorAppointments = [];
    this.invalidDate = false;
    this.openGroups = {};
  }

 onClinicChange() {
  this.resetSelections();
  this.doctors = [];

  if (!this.selectedClinicId) return;

  this.clinicService.getDoctorsByClinicId(this.selectedClinicId).subscribe({
    next: (data) => {
      console.log("Gelen doktorlar:", data); 
      this.doctors = data;
    },
    error: (err) => console.error('Doktorlar alınamadı:', err)
  });
}

  onDateChange(event: any) {
    const selected = new Date(event.target.value);
    const day = selected.getDay();
    this.invalidDate = (day === 0 || day === 6);

    if (this.invalidDate) {
      this.groupedTimeSlots = [];
      this.selectedTime = '';
      return;
    }

    if (this.selectedDoctorId) {
      this.appointmentService.getAppointmentsByDoctorAndDate(this.selectedDoctorId, this.selectedDate).subscribe({
        next: (appointments) => {
          this.doctorAppointments = appointments;
          this.generateTimeSlots();
        },
        error: (err) => console.error('Doktor randevuları alınamadı:', err)
      });
    }
  }
  onDoctorChange() {
  this.selectedDate = '';
  this.selectedTime = '';
  this.groupedTimeSlots = [];
  this.pastTimes = [];
  this.doctorAppointments = [];
}


  generateTimeSlots() {
    const startHour = 8;
    const endHour = 17;
    const interval = 20;
    const today = new Date();
    const selected = new Date(this.selectedDate);

    this.groupedTimeSlots = [];
    this.pastTimes = [];

    for (let hour = startHour; hour < endHour; hour++) {
      if (hour === 12) continue;

      const slots: string[] = [];

      for (let minute = 0; minute < 60; minute += interval) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        if (
          selected.toDateString() === today.toDateString() &&
          (hour < today.getHours() || (hour === today.getHours() && minute <= today.getMinutes()))
        ) {
          this.pastTimes.push(time);
        }

        slots.push(time);
      }

      if (slots.length > 0) {
        const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
        this.groupedTimeSlots.push({ hour: hourLabel, slots });
        this.openGroups[hourLabel] = false;
      }
    }
  }

  toggleGroup(hour: string) {
    this.openGroups[hour] = !this.openGroups[hour];
  }

  isGroupOpen(hour: string): boolean {
    return this.openGroups[hour];
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }

  onSubmit() {
  if (!this.patientId || !this.selectedDoctorId || !this.selectedClinicId || !this.selectedTime || !this.selectedDate) return;

  this.appointmentService.getAppointmentsByPatientId(this.patientId).subscribe({
    next: (appointments) => {
      this.allAppointments = appointments;

      const sameClinicAppointment = appointments.find(
        a => a.clinic?.id === this.selectedClinicId && a.status === 'AKTIF'
      );

      if (sameClinicAppointment) {
        const confirmReplace = confirm("Bu klinikte daha önce alınmış aktif bir randevunuz bulunuyor. Yeni randevu alırsanız, önceki iptal edilecek. Devam etmek istiyor musunuz?");
        if (!confirmReplace) return;
      }

      const sameDateTimeOtherClinicAppointment = appointments.find(
        a =>
          a.date === this.selectedDate &&
          a.time?.substring(0, 5) === this.selectedTime &&
          a.clinic?.id !== this.selectedClinicId &&
          a.status === 'AKTIF'
      );

      if (sameDateTimeOtherClinicAppointment) {
        alert(`${this.selectedDate} ${this.selectedTime} zaman aralığı ile çakışan başka bir klinikten aktif bir randevunuz bulunmaktadır. Lütfen farklı bir zaman seçiniz.`);
        return;
      }

      const appointmentData = {
        clinic: { id: this.selectedClinicId },
        date: this.selectedDate,
        time: this.selectedTime,
        description: this.description || "Online randevu alındı.",
        doctor: { id: this.selectedDoctorId },
        patient: { id: this.patientId }
      };

      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: () => {
          alert('Randevu başarıyla oluşturuldu!');
          this.resetForm();
        },
        error: (err) => {
          console.error('Randevu sırasında hata oluştu:', err);
          alert('Randevu oluşturulamadı.');
        }
      });
    },
    error: (err) => {
      console.error('Hasta randevuları alınamadı:', err);
    }
  });
}


  resetForm() {
    this.selectedClinicId = null;
    this.description = '';
    this.doctors = [];
    this.allAppointments = [];
    this.resetSelections();

    if (this.patientId) {
      this.getPatientAppointments(this.patientId);
    }
  }

  isTimeDisabled(time: string): boolean {
    const isPast = this.pastTimes.includes(time);
    const isTaken = this.doctorAppointments.some(
      a => a.time?.substring(0, 5) === time && a.status === 'AKTIF'
    );
    return isPast || isTaken;
  }
}
