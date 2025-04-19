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
  // Sabit klinik listesi
  clinics: string[] = CLINICS;
  // Seçilen kliniğe göre doktorlar
  doctors: any[] = [];

  // Randevu saatleri ve geçmiş saatler
  timeSlots: string[] = [];
  pastTimes: string[] = [];

    // Saatleri gruplanmış şekilde tutmak için
  groupedTimeSlots: { hour: string, slots: string[] }[] = [];

    // Tarih aralığı (bugünden itibaren 2 ay sonrası)
  minDate = new Date().toISOString().split('T')[0];
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0];
  invalidDate = false;

    // Kullanıcının formda yaptığı seçimler
  selectedClinic: string = '';
  selectedDoctorId: number | null = null;
  selectedDate: string = '';
  selectedTime: string = '';
  patientId: number | null = null;

   // Seçilen doktora ait alınmış randevular
   existingAppointments: any[] = [];

   // Açıklama alanı (kullanıcı doldurmazsa varsayılan metin atanır)
   description: string = "";

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
        // Giriş yapan kullanıcının  bilgilerini al
    this.userService.getCurrentUser().subscribe({
      
      next: (user) => {
        this.patientId = user.id;
      },
      error: (err) => {
        console.error('Kullanci alinamadi:', err);
      }
    });
  }

    // Klinik değiştiğinde doktor listesini yenile
  onClinicChange() {
    this.selectedDoctorId = null;
    this.selectedDate = '';
    this.selectedTime = '';
    this.doctors = [];
    this.groupedTimeSlots = [];
    this.existingAppointments = [];
    this.invalidDate = false;
    this.userService.getUsersBySpecialization(this.selectedClinic).subscribe({
      
      next: (data) => {
        this.doctors = data;
        
      },
      error: (err) => {
        console.error('Doktorlar alinamadi:', err);
      }
    });
  }
  // Tarih değiştiğinde geçerli mi kontrol et ve uygun saatleri getir
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

    // Randevu saatlerini 08:00 - 17:00 arası 20 dakika aralıkla oluştur
  generateTimeSlots() {
    const startHour = 8;
    const endHour = 17;
    const interval = 20;

    const today = new Date();
    const selected = new Date(this.selectedDate);

    this.groupedTimeSlots = [];
    this.pastTimes = [];

    for (let hour = startHour; hour < endHour; hour++) {
      const slots: string[] = [];

      for (let minute = 0; minute < 60; minute += interval) {
        if (hour === 12) continue;
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
        // Bugünün geçmiş saatlerini ayıkla
        if (
          selected.toDateString() === today.toDateString() &&
          (hour < today.getHours() || (hour === today.getHours() && minute <= today.getMinutes()))
        ) {
          this.pastTimes.push(time);
        }
  
        slots.push(time);
      }
      if (slots.length > 0) {
        this.groupedTimeSlots.push({ hour: `${hour}:00`, slots });
      }
    }
  }

    // Saat seçimi
  selectTime(time: string) {
    this.selectedTime = time;
  }

    // Randevu oluşturma işlemi
  onSubmit() {
    if (!this.patientId || !this.selectedDoctorId || !this.selectedTime || !this.selectedDate) return;

    const sameClinicAppointment = this.existingAppointments.find(
      a =>
        a.patient?.id === this.patientId &&
        a.clinic === this.selectedClinic &&
        a.status === 'AKTIF' // sadece aktifleri kontrol et
    );
    if (sameClinicAppointment) {
      const confirmReplace = confirm(
        "Bu klinikte daha önce alınmış aktif bir randevunuz bulunuyor.\nYeni randevuyu alırsanız, önceki iptal edilecek.\nDevam etmek istiyor musunuz?"
      );
  
      if (!confirmReplace) {
        return;
      }
    }
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

  // Formu sıfırla
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
  isTimeDisabled(time: string): boolean {
    const isPast = this.pastTimes.includes(time);
  
    const isTaken = this.existingAppointments.some(
      a => a.time?.substring(0, 5) === time && a.status === 'AKTIF'  // 👈 sadece aktifleri al
    );
  
    return isPast || isTaken;
  }
}
