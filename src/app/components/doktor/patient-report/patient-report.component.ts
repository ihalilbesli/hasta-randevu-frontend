import { Component } from '@angular/core';
import { PatientReportService } from '../../../service/patient-report/patient-report.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-patient-report',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './patient-report.component.html',
  styleUrl: './patient-report.component.css'
})
export class PatientReportComponent {
  doctorId: number | null = null;
  patients: any[] = [];
  reports: any[] = [];

  selectedPatientId: number | null = null;
  reportType: string = '';
  fileUrl: string = '';
  selectedPeriod: string = '';
  searchKeyword: string = '';
  editingReportId: number | null = null;

  patientMode: 'today' | 'all' = 'today';
  activeTab: '' | 'add' | 'list' = '';

  constructor(
    private reportService: PatientReportService,
    private doctorPatientService: DoctorPatientService,
    private userService: UserService
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
    this.reports = [];
    this.loadPatients();
  }

  selectTab(tab: 'add' | 'list') {
    if (tab === 'add' && this.patientMode === 'all') {
      alert("Randevusuz hasta için rapor eklenemez.");
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') this.loadReports();
  }

  createOrUpdateReport(): void {
    const reportData = {
      patient: { id: this.selectedPatientId },
      reportType: this.reportType,
      fileUrl: this.fileUrl
    };

    if (this.editingReportId) {
      this.reportService.updateReport(this.editingReportId, reportData).subscribe({
        next: () => {
          alert("Rapor güncellendi.");
          this.resetForm();
          this.loadReports();
        }
      });
    } else {
      this.reportService.createReport(reportData).subscribe({
        next: () => {
          alert("Rapor eklendi.");
          this.resetForm();
          this.loadReports();
        }
      });
    }
  }

  loadReports(): void {
    if (!this.selectedPatientId || !this.doctorId) return;

    if (this.patientMode === 'all') {
      this.reportService.getReportsByPatientId(this.selectedPatientId).subscribe({
        next: (res) => this.reports = res
      });
      return;
    }

    if (this.selectedPatientId) {
      this.reportService.getReportsByPatientId(this.selectedPatientId).subscribe({
        next: (res) => this.reports = res
      });
    }
    
  }

  searchReports(): void {
    if (!this.searchKeyword.trim()) return;
    this.reportService.searchByKeyword(this.searchKeyword).subscribe({
      next: (res) => this.reports = res
    });
  }

  editReport(report: any): void {
    this.reportType = report.reportType;
    this.fileUrl = report.fileUrl;
    this.editingReportId = report.id;
    this.activeTab = 'add';
  }

  deleteReport(id: number): void {
    if (confirm("Silmek istediğinize emin misiniz?")) {
      this.reportService.deleteReport(id).subscribe({
        next: () => {
          alert("Rapor silindi.");
          this.loadReports();
        }
      });
    }
  }

  goBack(): void {
    this.activeTab = '';
    this.selectedPatientId = null;
    this.reports = [];
    this.resetForm();
  }

  resetForm(): void {
    this.reportType = '';
    this.fileUrl = '';
    this.editingReportId = null;
  }
  onPatientChange(): void {
    this.activeTab = ''; // Böylece rapor ekle/gör butonları tekrar çıkar
    this.reports = [];   // Önceki hasta raporları temizlensin
  }
}


