import { Component } from '@angular/core';
import { PrescriptionService } from '../../../../service/presccription/prescription.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescriptions-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prescriptions-export.component.html',
  styleUrl: './prescriptions-export.component.css'
})
export class PrescriptionsExportComponent {

  prescriptions: any[] = [];

  constructor(
    private prescriptionService: PrescriptionService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.prescriptionService.getAll().subscribe({
      next: (data) => this.prescriptions = data,
      error: () => alert("Reçete verileri getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportPrescriptions().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'prescriptions.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
