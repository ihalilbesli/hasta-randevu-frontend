import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../../../service/presccription/prescription.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderComponent],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  patientMode: 'today' | 'all' = 'today';
  activeTab: '' | 'write' | 'list' = '';

  patients: any[] = [];
  selectedPatientId: number | null = null;

  medications: string = '';
  description: string = '';

  prescriptions: any[] = [];
  searchKeyword: string = '';
  filterPeriod: string = 'all';

  doctorId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private doctorPatientService: DoctorPatientService,
    private userService: UserService,
  
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        this.loadPatients();
        this.loadPrescriptions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kullanıcı alınamadı:', error);
        this.isLoading = false;
      }
    });
  }

  loadPatients(): void {
    const observable = this.patientMode === 'today'
      ? this.doctorPatientService.getMyPatientsToday()
      : this.doctorPatientService.getMyPatients();

    observable.subscribe({
      next: (patients) => this.patients = patients,
      error: (error) => console.error('Hastalar yüklenemedi:', error)
    });
  }

  selectPatientMode(mode: 'today' | 'all'): void {
    this.patientMode = mode;
    this.selectedPatientId = null;
    this.activeTab = '';
    this.loadPatients();
  }

  onPatientChange(): void {
    this.activeTab = '';
  }

  loadPrescriptions(): void {
    if (this.selectedPatientId) {
      this.prescriptionService.getPrescriptionsByPatient(this.selectedPatientId).subscribe({
        next: (prescriptions) => this.prescriptions = prescriptions,
        error: (error) => console.error('Reçeteler yüklenemedi:', error)
      });
    } else {
      this.prescriptions = [];
    }
  }
  
  

  createPrescription(): void {
    if (this.selectedPatientId && this.medications.trim() && this.description.trim()) {
      const prescriptionData = {
        patient: { id: this.selectedPatientId },
        medications: this.medications,
        description: this.description
      };

      this.prescriptionService.createPrescription(prescriptionData).subscribe({
        next: () => {
          alert('Reçete başarıyla oluşturuldu!');
          this.resetForm();
          this.loadPrescriptions();
          this.activeTab = '';
        },
        error: (error) => {
          console.error('Reçete oluşturulamadı:', error);
        }
      });
    } else {
      alert('Lütfen tüm alanları doldurun.');
    }
  }

  resetForm(): void {
    this.selectedPatientId = null;
    this.medications = '';
    this.description = '';
  }
  filterPrescriptions(): void {
    if (this.filterPeriod !== 'all' && this.selectedPatientId !== null) {
      this.prescriptionService.getPrescriptionsByPeriod(this.selectedPatientId, this.filterPeriod).subscribe({
        next: (prescriptions) => {
          this.prescriptions = prescriptions;
        },
        error: (error) => {
          console.error('Reçeteler filtrelenemedi:', error);
        }
      });
    } else {
      this.loadPrescriptions();
    }
  }

  searchPrescriptions(): void {
    if (this.searchKeyword.trim()) {
      this.prescriptionService.searchPrescriptions(this.searchKeyword).subscribe({
        next: (prescriptions) => {
          this.prescriptions = prescriptions;
        },
        error: (error) => {
          console.error('Reçete araması başarısız:', error);
        }
      });
    } else {
      this.loadPrescriptions();
    }
  }

  deletePrescription(id: number): void {
    if (confirm('Bu reçeteyi silmek istediğinize emin misiniz?')) {
      this.prescriptionService.deletePrescription(id).subscribe({
        next: () => {
          alert('Reçete silindi.');
          this.loadPrescriptions();
        },
        error: (error) => {
          console.error('Reçete silinemedi:', error);
        }
      });
    }
  }
  selectListTab(): void {
    this.activeTab = 'list';
    this.loadPrescriptions();
  }
}
