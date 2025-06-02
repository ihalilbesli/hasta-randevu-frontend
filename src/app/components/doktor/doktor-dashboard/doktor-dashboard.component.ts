import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { AppointmentService } from '../../../service/appoinment/appointment.service';

@Component({
  selector: 'app-doktor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doktor-dashboard.component.html',
  styleUrl: './doktor-dashboard.component.css'
})
export class DoktorDashboardComponent {
  currentUser: any;
  patientsToday: any[] = [];
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private doctorPatientService: DoctorPatientService,
    private appointmentService: AppointmentService
  ) { }
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadPatientsToday();
      },
      error: (err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      }
    });
  }
  loadPatientsToday(): void {
    this.isLoading = true;
    this.doctorPatientService.getMyPatientsTodayFull().subscribe({
      next: (patients) => {
        this.patientsToday = patients;
        console.log("Gelen hastalar (patientsToday):", this.patientsToday); // <--- BURASI

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Bugünkü hastalar alınamadı:', error);
        this.isLoading = false;
      }
    });
  }


  goTo(path: string) {
    this.router.navigate([`/${path}`]);
    console.log(path + " navigate edildi");

  }
  goToPatientDetail(patientId: number): void {
    this.router.navigate(['/my-patients'], { queryParams: { id: patientId } });
  }
  goToExaminationForPatient(patientId: number): void {
    const matching = this.patientsToday.find(p => p.id === patientId && p.appointmentId);
    if (matching) {
      this.router.navigate(['/examination', matching.appointmentId]);
    } else {
      alert('Bu hastanın aktif randevusu bulunmamaktadır.');
    }
  }

}
