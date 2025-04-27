import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../../service/presccription/prescription.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css']
})
export class PrescriptionComponent implements OnInit {
  activeTab: 'write' | 'list' = 'write'; // Sekme kontrolü

  // Reçete Yazma Alanı
  patients: any[] = [];
  selectedPatientId: number | null = null;
  medications: string = '';
  description: string = '';

  // Reçetelerim Alanı
  prescriptions: any[] = [];
  searchKeyword: string = '';
  filterPeriod: string = 'all'; // all, day, week, month

  doctorId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private doctorPatientService: DoctorPatientService,
    private userService: UserService,          // ✔️ doğru şekilde yazıldı
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => { // ✔️ user tipi any verildi
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
    this.doctorPatientService.getMyPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Hastalar yüklenemedi:', error);
      }
    });
  }

  loadPrescriptions(): void {
    if (this.doctorId !== null) {
      this.prescriptionService.getPrescriptionsByDoctor(this.doctorId).subscribe({
        next: (prescriptions) => {
          this.prescriptions = prescriptions;
        },
        error: (error) => {
          console.error('Reçeteler yüklenemedi:', error);
        }
      });
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
    if (this.filterPeriod !== 'all' && this.doctorId !== null) {
      this.prescriptionService.getPrescriptionsByDoctorAndPeriod(this.doctorId, this.filterPeriod).subscribe({
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
}
