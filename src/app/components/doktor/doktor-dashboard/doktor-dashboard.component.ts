import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';

@Component({
  selector: 'app-doktor-dashboard',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './doktor-dashboard.component.html',
  styleUrl: './doktor-dashboard.component.css'
})
export class DoktorDashboardComponent {
  currentUser:any;
  patientsToday: any[] = [];
  isLoading = false;

  constructor(
      private userService:UserService,
      private router:Router,
      private authService:AuthService,
      private doctorPatientService:DoctorPatientService
    ){}
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
    this.doctorPatientService.getMyPatientsToday().subscribe({
      next: (patients) => {
        this.patientsToday = patients;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Bugünkü hastalar alınamadı:', error);
        this.isLoading = false;
      }
    });
  }


  goTo(path:string){
    this.router.navigate([`/${path}`]);
  console.log(path+" navigate edildi");
    
  }
  goToPatientDetail(patientId: number): void {
    this.router.navigate(['/my-patients'], { queryParams: { id: patientId } });
  }
  
}
