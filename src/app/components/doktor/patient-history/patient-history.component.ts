import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { PatientHistoryService } from '../../../service/patient-history/patient-history.service';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr eklendi

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private historyService: PatientHistoryService,
    private toastr: ToastrService // ✅ inject edildi
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    const obs = this.patientMode === 'today'
      ? this.doctorPatientService.getMyPatientsToday()
      : this.doctorPatientService.getMyPatients();

    obs.subscribe({
      next: (res) => this.patients = res,
      error: () => this.toastr.error('Hastalar yüklenemedi.')
    });
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
      this.toastr.warning("Randevusuz hastaya geçmiş eklenemez.");
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') {
      this.loadHistories();
    }
  }

  createOrUpdateHistory(): void {
    if (!this.diagnosis.trim()) {
      this.toastr.warning("Tanı alanı zorunludur.");
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
          this.toastr.success("Geçmiş başarıyla güncellendi.");
          this.resetForm();
          this.loadHistories();
          this.activeTab = 'list';
        },
        error: () => this.toastr.error("Güncelleme başarısız.")
      });
    } else {
      this.historyService.createHistory(historyData).subscribe({
        next: () => {
          this.toastr.success("Geçmiş başarıyla eklendi.");
          this.resetForm();
          this.activeTab = '';
        },
        error: () => this.toastr.error("Geçmiş eklenemedi.")
      });
    }
  }

  loadHistories(): void {
    if (!this.selectedPatientId) return;

    const obs = this.selectedPeriod
      ? this.historyService.getHistoriesByPeriod(this.selectedPatientId, this.selectedPeriod)
      : this.historyService.getHistoriesByPatientId(this.selectedPatientId);

    obs.subscribe({
      next: (res) => this.histories = res,
      error: () => this.toastr.error("Geçmiş kayıtları alınamadı.")
    });
  }

  searchHistories(): void {
    if (!this.searchKeyword.trim()) return;

    const searchFn = this.searchField === 'diagnosis'
      ? this.historyService.searchByDiagnosis(this.searchKeyword)
      : this.historyService.searchByTreatment(this.searchKeyword);

    searchFn.subscribe({
      next: (res) => this.histories = res,
      error: () => this.toastr.error("Arama işlemi başarısız oldu.")
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
          this.toastr.success("Geçmiş kaydı silindi.");
          this.loadHistories();
        },
        error: () => this.toastr.error("Silme işlemi başarısız oldu.")
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
