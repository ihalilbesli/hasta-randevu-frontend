import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientReportService } from '../../../service/patient-report/patient-report.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-patient-report',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './patient-report.component.html',
  styleUrl: './patient-report.component.css'
})
export class PatientReportComponent {
  reports: any[] = [];
  filteredReports: any[] = [];

  
  selectedPeriod = 'all';
  keyword = '';
  patientId: number | null = null;

  constructor(
    private reportService: PatientReportService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.fetchReports();
      },
      error: (err) => console.error('Kullanıcı alınamadı', err)
    });
  }
  fetchReports() {
    if (!this.patientId) return;

    if (this.selectedPeriod === 'all') {
      this.reportService.getReportsByPatientId(this.patientId).subscribe({
        next: (data) => {
          this.reports = data;
          this.applyKeyword();
        }
      });
    } else {
      this.reportService.getReportsByPatientAndPeriod(this.patientId, this.selectedPeriod).subscribe({
        next: (data) => {
          this.reports = data;
          this.applyKeyword();
        }
      });
    }
  }
  applyKeyword() {
    if (!this.keyword) {
      this.filteredReports = this.reports;
    } else {
      this.filteredReports = this.reports.filter(r =>
        r.reportType.toLowerCase().includes(this.keyword.toLowerCase())
      );
    }
  }
}

