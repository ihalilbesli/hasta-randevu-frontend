import { Component } from '@angular/core';
import { PatientReportService } from '../../../../service/patient-report/patient-report.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-reports-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-reports-export.component.html',
  styleUrl: './patient-reports-export.component.css'
})
export class PatientReportsExportComponent {
  reports: any[] = [];

  constructor(
    private patientReportService: PatientReportService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.patientReportService.getAllReports().subscribe({
      next: (data) => this.reports = data,
      error: () => alert("Hasta raporları getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportPatientReports().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'patient-reports.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
