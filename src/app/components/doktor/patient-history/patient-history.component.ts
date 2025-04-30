import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { PatientHistoryService } from '../../../service/patient-history/patient-history.service';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent {
  doctorId: number | null = null;
  patients: any[] = [];
  selectedPatientId: number | null = null;
  activeTab: '' | 'add' | 'list' = '';

  diagnosis = '';
  treatment = '';
  notes = '';
  editingHistoryId: number | null = null;

  histories: any[] = [];

  patientMode: 'today' | 'all' = 'today';

  searchKeyword = '';
  searchField: 'diagnosis' | 'treatment' = 'diagnosis';
  selectedPeriod = '';

  constructor(
    private doctorPatientService: DoctorPatientService,
    private historyService: PatientHistoryService
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    if (this.patientMode === 'today') {
      this.doctorPatientService.getMyPatientsToday().subscribe({
        next: (res) => this.patients = res
      });
    } else {
      this.doctorPatientService.getMyPatients().subscribe({
        next: (res) => this.patients = res
      });
    }
  }

  selectPatientMode(mode: 'today' | 'all'): void {
    this.patientMode = mode;
    this.selectedPatientId = null;
    this.activeTab = '';
    this.histories = [];
    this.loadPatients();
  }

  onPatientChange(): void {
    this.activeTab = '';
    this.histories = [];
  }

  selectTab(tab: 'add' | 'list') {
    if (tab === 'add' && this.patientMode === 'all') {
      alert("Randevusuz hastaya geçmiş eklenemez.");
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') {
      this.loadHistories();
    }
  }

  createOrUpdateHistory(): void {
    if (!this.diagnosis.trim()) {
      alert("Tanı alanı zorunludur.");
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
          alert("Geçmiş güncellendi!");
          this.resetForm();
          this.loadHistories();
          this.activeTab = 'list';
        }
      });
    } else {
      this.historyService.createHistory(historyData).subscribe({
        next: () => {
          alert("Geçmiş eklendi!");
          this.resetForm();
          this.activeTab = '';
        }
      });
    }
  }

  loadHistories(): void {
    if (!this.selectedPatientId) return;

    if (this.selectedPeriod) {
      this.historyService.getHistoriesByPeriod(this.selectedPatientId, this.selectedPeriod).subscribe({
        next: (res) => this.histories = res
      });
    } else {
      this.historyService.getHistoriesByPatientId(this.selectedPatientId).subscribe({
        next: (res) => this.histories = res
      });
    }
  }

  searchHistories(): void {
    if (!this.searchKeyword.trim()) return;

    const searchFn = this.searchField === 'diagnosis'
      ? this.historyService.searchByDiagnosis(this.searchKeyword)
      : this.historyService.searchByTreatment(this.searchKeyword);

    searchFn.subscribe({
      next: (res) => this.histories = res
    });
  }

  editHistory(history: any): void {
    this.editingHistoryId = history.id;
    this.diagnosis = history.diagnosis;
    this.treatment = history.treatment;
    this.notes = history.notes;
    this.activeTab = 'add';
  }

  deleteHistory(id: number): void {
    if (confirm("Bu kaydı silmek istiyor musunuz?")) {
      this.historyService.deleteHistory(id).subscribe({
        next: () => {
          alert("Geçmiş kaydı silindi.");
          this.loadHistories();
        }
      });
    }
  }

  resetForm(): void {
    this.diagnosis = '';
    this.treatment = '';
    this.notes = '';
    this.editingHistoryId = null;
    this.selectedPatientId = null;
  }
  
}
