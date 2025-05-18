import { Component } from '@angular/core';
import { ComplaintService } from '../../../../service/complaint/complaint.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaints-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './complaints-export.component.html',
  styleUrl: './complaints-export.component.css'
})
export class ComplaintsExportComponent {
   complaints: any[] = [];

  constructor(
    private complaintService: ComplaintService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => this.complaints = data,
      error: () => alert("Şikayet verileri getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportComplaints().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'complaints.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
