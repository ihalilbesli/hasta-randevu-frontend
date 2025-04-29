import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { PatientHistoryService } from '../../../service/patient-history/patient-history.service';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent {
  patients: any[] = [];
  selectedPatientId: number | null = null;
  activeTab: '' | 'add' | 'list' = '';

  diagnosis: string = '';
  treatment: string = '';
  notes: string = '';

  histories: any[] = [];
  editingHistoryId: number | null = null;

  patientMode: 'today' | 'all' = 'today';
  doctorId: number | null = null;

  searchKeyword: string = '';
  searchField: 'diagnosis' | 'treatment' = 'diagnosis';
  selectedPeriod: string = '';

  constructor(
    private doctorPatientService: DoctorPatientService,
    private historyService: PatientHistoryService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    if (this.patientMode === 'today') {
      this.loadMyPatientsToday();
    } else {
      this.loadAllMyPatients();
    }
  }

  loadMyPatientsToday(): void {
    this.doctorPatientService.getMyPatientsToday().subscribe({
      next: (res) => this.patients = res,
      error: (err) => console.error('Bugünkü hastalar yüklenemedi:', err)
    });
  }

  loadAllMyPatients(): void {
    this.doctorPatientService.getMyPatients().subscribe({
      next: (res) => this.patients = res,
      error: (err) => console.error('Hastalar yüklenemedi:', err)
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

  selectTab(tab: 'add' | 'list') {
    if (tab === 'add' && this.patientMode === 'all') {
      alert('Randevusu olmayan hastaya geçmiş ekleyemezsiniz.');
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') {
      this.loadHistories();
    }
  }

  createOrUpdateHistory(): void {
    if (!this.diagnosis.trim()) {
      alert('Tanı alanı zorunludur!');
      return;
    }

    const historyData = {
      patient: { id: this.selectedPatientId },
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      notes: this.notes
    };

    if (this.editingHistoryId) {
      this.historyService.updateHistory(this.editingHistoryId, historyData).subscribe({
        next: () => {
          alert('Geçmiş güncellendi!');
          this.resetForm();
          this.loadHistories();
          this.activeTab = 'list';
        },
        error: (err) => console.error('Güncelleme hatası:', err)
      });
    } else {
      this.historyService.createHistory(historyData).subscribe({
        next: () => {
          alert('Geçmiş eklendi!');
          this.resetForm();
          this.activeTab = '';
        },
        error: (err) => console.error('Kayıt hatası:', err)
      });
    }
  }

  loadHistories(): void {
    if (!this.selectedPatientId) return;

    if (this.selectedPeriod) {
      this.historyService.getHistoriesByPeriod(this.selectedPatientId, this.selectedPeriod).subscribe({
        next: (res) => this.histories = res,
        error: (err) => console.error('Filtreli geçmiş alınamadı:', err)
      });
    } else {
      this.historyService.getHistoriesByPatientId(this.selectedPatientId).subscribe({
        next: (res) => this.histories = res,
        error: (err) => console.error('Geçmişler alınamadı:', err)
      });
    }
  }

  searchHistories(): void {
    if (!this.searchKeyword.trim()) return;

    const searchFn = this.searchField === 'diagnosis'
      ? this.historyService.searchByDiagnosis(this.searchKeyword)
      : this.historyService.searchByTreatment(this.searchKeyword);

    searchFn.subscribe({
      next: (res) => this.histories = res,
      error: (err) => console.error('Arama hatası:', err)
    });
  }

  deleteHistory(id: number): void {
    if (confirm('Kaydı silmek istiyor musunuz?')) {
      this.historyService.deleteHistory(id).subscribe({
        next: () => {
          alert('Silindi!');
          this.loadHistories();
        },
        error: (err) => console.error('Silinemedi:', err)
      });
    }
  }

  editHistory(history: any): void {
    this.editingHistoryId = history.id;
    this.diagnosis = history.diagnosis;
    this.treatment = history.treatment;
    this.notes = history.notes;
    this.activeTab = 'add';
  }

  resetForm(): void {
    this.diagnosis = '';
    this.treatment = '';
    this.notes = '';
    this.editingHistoryId = null;
    this.selectedPatientId = null;
  }
  
}
