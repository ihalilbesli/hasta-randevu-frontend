import { Component } from '@angular/core';
import { PatientHistoryService } from '../../../../service/patient-history/patient-history.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-histories-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-histories-export.component.html',
  styleUrl: './patient-histories-export.component.css'
})
export class PatientHistoriesExportComponent {
  histories: any[] = [];

  constructor(
    private patientHistoryService: PatientHistoryService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.patientHistoryService.getAllHistories().subscribe({
      next: data => this.histories = data,
      error: () => alert("Hasta geçmişi verileri getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportPatientHistories().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'patient-histories.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
