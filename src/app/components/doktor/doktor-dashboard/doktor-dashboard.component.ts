import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { ToastrService } from 'ngx-toastr';

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
    private appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.loadPatientsToday();
      },
      error: () => {
        this.toastr.error('Kullanıcı bilgisi alınamadı.');
      }
    });
  }

  loadPatientsToday(): void {
    this.isLoading = true;
    this.doctorPatientService.getMyPatientsTodayFull().subscribe({
      next: (patients) => {
        this.patientsToday = patients.filter(p => p.status !== 'IPTAL_EDILDI');
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Bugünkü hastalar alınamadı.');
        this.isLoading = false;
      }
    });
  }

  goTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  goToPatientDetail(patientId: number): void {
    this.router.navigate(['/my-patients'], { queryParams: { id: patientId } });
  }

  goToExaminationForPatient(patientId: number): void {
    const matching = this.patientsToday.find(p => p.patient?.id === patientId);

    if (matching) {
      this.router.navigate(['/examination', matching.id]);
    } else {
      this.toastr.warning('Bu hastanın aktif randevusu bulunmamaktadır.');
    }
  }
}
