import { Component } from '@angular/core';
import { TestResultService } from '../../../../service/test-result/test-result.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-result-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-result-export.component.html',
  styleUrl: './test-result-export.component.css'
})
export class TestResultExportComponent {
 testResults: any[] = [];

  constructor(
    private testResultService: TestResultService,
    private exportService: ExportService
  ) {}

  ngOnInit(): void {
    this.testResultService.getAllTestResults().subscribe({
      next: data => this.testResults = data,
      error: () => alert("Test sonuçları getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportTestResults().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'test-results.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
