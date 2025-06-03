import { Component } from '@angular/core';
import { PatientReportService } from '../../../service/patient-report/patient-report.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ToastrService } from 'ngx-toastr'; // ✅ Toastr eklendi

@Component({
  selector: 'app-patient-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    private userService: UserService,
    private toastr: ToastrService // ✅ inject edildi
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (res) => {
        this.doctorId = res.id;
        this.loadPatients();
      },
      error: () => this.toastr.error("Kullanıcı bilgisi alınamadı.")
    });
  }

  loadPatients(): void {
    const obs = this.patientMode === 'today'
      ? this.doctorPatientService.getMyPatientsToday()
      : this.doctorPatientService.getMyPatients();

    obs.subscribe({
      next: (res) => this.patients = res,
      error: () => this.toastr.error("Hastalar yüklenemedi.")
    });
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
      this.toastr.warning("Randevusuz hasta için rapor eklenemez.");
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') this.loadReports();
  }

  createOrUpdateReport(): void {
    if (!this.reportType.trim()) {
      this.toastr.warning("Rapor tipi boş olamaz.");
      return;
    }

    const reportData = {
      patient: { id: this.selectedPatientId },
      reportType: this.reportType,
      fileUrl: this.fileUrl
    };

    if (this.editingReportId) {
      this.reportService.updateReport(this.editingReportId, reportData).subscribe({
        next: () => {
          this.toastr.success("Rapor başarıyla güncellendi.");
          this.resetForm();
          this.loadReports();
        },
        error: () => this.toastr.error("Rapor güncellenemedi.")
      });
    } else {
      this.reportService.createReport(reportData).subscribe({
        next: () => {
          this.toastr.success("Rapor başarıyla eklendi.");
          this.resetForm();
          this.loadReports();
        },
        error: () => this.toastr.error("Rapor eklenemedi.")
      });
    }
  }

  loadReports(): void {
    if (!this.selectedPatientId || !this.doctorId) return;

    this.reportService.getReportsByPatientId(this.selectedPatientId).subscribe({
      next: (res) => this.reports = res,
      error: () => this.toastr.error("Raporlar yüklenemedi.")
    });
  }

  searchReports(): void {
    if (!this.searchKeyword.trim()) return;
    this.reportService.searchByKeyword(this.searchKeyword).subscribe({
      next: (res) => this.reports = res,
      error: () => this.toastr.error("Arama işlemi başarısız oldu.")
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
          this.toastr.success("Rapor başarıyla silindi.");
          this.loadReports();
        },
        error: () => this.toastr.error("Silme işlemi başarısız oldu.")
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
    this.activeTab = '';
    this.reports = [];
  }
}
