import { Component, OnInit } from '@angular/core';
import { PrescriptionService } from '../../../service/presccription/prescription.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr eklendi

@Component({
  selector: 'app-prescription',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private toastr: ToastrService // ✅ inject edildi
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        this.loadPatients();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Kullanıcı bilgisi alınamadı.');
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
      error: () => this.toastr.error('Hastalar yüklenemedi.')
    });
  }

  selectPatientMode(mode: 'today' | 'all'): void {
    this.patientMode = mode;
    this.selectedPatientId = null;
    this.activeTab = '';
    this.prescriptions = [];
    this.loadPatients();
  }

  onPatientChange(): void {
    this.activeTab = '';
    this.prescriptions = [];

    if (this.patientMode === 'today' && this.selectedPatientId) {
      this.loadPrescriptions();
    }
  }

  loadPrescriptions(): void {
    if (!this.selectedPatientId) return;

    this.prescriptionService.getPrescriptionsByPatient(this.selectedPatientId).subscribe({
      next: (prescriptions) => this.prescriptions = prescriptions,
      error: (error) => {
        if (error.status === 403) {
          this.toastr.warning("Bu hastanın reçetelerine erişim yetkiniz yok.");
        } else {
          this.toastr.error('Reçeteler yüklenemedi.');
        }
      }
    });
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
          this.toastr.success('Reçete başarıyla oluşturuldu!');
          this.resetForm();
          this.loadPrescriptions();
          this.activeTab = '';
        },
        error: () => {
          this.toastr.error('Reçete oluşturulamadı.');
        }
      });
    } else {
      this.toastr.warning('Lütfen tüm alanları doldurun.');
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
        next: (prescriptions) => this.prescriptions = prescriptions,
        error: () => this.toastr.error('Reçeteler filtrelenemedi.')
      });
    } else {
      this.loadPrescriptions();
    }
  }

  searchPrescriptions(): void {
    if (this.searchKeyword.trim()) {
      this.prescriptionService.searchPrescriptions(this.searchKeyword).subscribe({
        next: (prescriptions) => this.prescriptions = prescriptions,
        error: () => this.toastr.error('Reçete araması başarısız oldu.')
      });
    } else {
      this.loadPrescriptions();
    }
  }

  deletePrescription(id: number): void {
    if (confirm('Bu reçeteyi silmek istediğinize emin misiniz?')) {
      this.prescriptionService.deletePrescription(id).subscribe({
        next: () => {
          this.toastr.success('Reçete başarıyla silindi.');
          this.loadPrescriptions();
        },
        error: () => this.toastr.error('Reçete silinemedi.')
      });
    }
  }

  selectListTab(): void {
    this.activeTab = 'list';
    this.loadPrescriptions();
  }
}
