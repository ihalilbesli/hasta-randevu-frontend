import { Component } from '@angular/core';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import DoctorService from '../../../service/doctor-service/doctor-service.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-patients',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './my-patients.component.html',
  styleUrl: './my-patients.component.css'
})
export class MyPatientsComponent {
  private buildCountMap(data: any[]): Map<number, number> {
    const map = new Map<number, number>();
    for (const item of data) {
      const patientId = item.patient?.id;
      if (patientId != null) {
        map.set(patientId, (map.get(patientId) || 0) + 1);
      }
    }
    return map;
  }
  
  doctorId: number | null = null;
  patients: any[] = [];
  filteredPatients: any[] = [];

  searchQuery: string = '';
  searchType: 'name' | 'email' = 'name';

  constructor(
    private doctorPatientService: DoctorPatientService,
    private doctorService: DoctorService,
    private userService: UserService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.doctorId = res.id;
        this.loadPatients();
      }
    });
  }

  loadPatients(): void {
    this.doctorPatientService.getMyPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.filteredPatients = [...patients];
        this.fetchCountsForPatients();
      }
    });
  }



  searchPatients(): void {
    const query = this.searchQuery.toLowerCase();
    if (this.searchType === 'name') {
      this.filteredPatients = this.patients.filter(p => p.name.toLowerCase().includes(query));
    } else {
      this.filteredPatients = this.patients.filter(p => p.email.toLowerCase().includes(query));
    }
  }
  async fetchCountsForPatients(): Promise<void> {
    if (!this.doctorId) return;
  
    // 1. Verileri bir kez çek
    const [
      appointments,
      prescriptions,
      testResults,
      histories,
      reports
    ] = await Promise.all([
      firstValueFrom(this.doctorService.getAppointmentsByDoctor(this.doctorId)),
      firstValueFrom(this.doctorService.getPrescriptionsByDoctor(this.doctorId)),
      firstValueFrom(this.doctorService.getTestResultsByDoctor(this.doctorId)),
      firstValueFrom(this.doctorService.getPatientHistoriesByDoctor(this.doctorId)),
      firstValueFrom(this.doctorService.getPatientReportsByDoctor(this.doctorId))
    ]);
  
    // 2. Her veri seti için Map oluştur
    const appointmentMap = this.buildCountMap(appointments);
    const prescriptionMap = this.buildCountMap(prescriptions);
    const testResultMap = this.buildCountMap(testResults);
    const historyMap = this.buildCountMap(histories);
    const reportMap = this.buildCountMap(reports);
  
    // 3. Her hasta için sayıları Map'ten çek
    for (let patient of this.patients) {
      const id = patient.id;
      patient.appointmentCount = appointmentMap.get(id) || 0;
      patient.prescriptionCount = prescriptionMap.get(id) || 0;
      patient.testResultCount = testResultMap.get(id) || 0;
      patient.historyCount = historyMap.get(id) || 0;
      patient.reportCount = reportMap.get(id) || 0;
    }
  }
  goToPrescription(patientId: number): void {
    this.router.navigate(['/doctor-prescriptions'], { queryParams: { patientId } });
    
  }
  
  goToTest(patientId: number): void {
    this.router.navigate(['/doctor-test-results'], { queryParams: { patientId } });
   
    
  }
  
  goToHistory(patientId: number): void {
    this.router.navigate(['/doctor-patient-history'], { queryParams: { patientId } });
    
  }
  
  goToReport(patientId: number): void {
    this.router.navigate(['/doctor-patient-reports'], { queryParams: { patientId } });
    
  }
}
