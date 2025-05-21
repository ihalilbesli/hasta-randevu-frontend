import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { AccessLogService } from '../../../service/access-log/access-log.service';

@Component({
  selector: 'app-admin-access-log',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './admin-access-log.component.html',
  styleUrl: './admin-access-log.component.css'
})
export class AdminAccessLogComponent {

  logs: any[] = [];
  filteredLogs: any[] = [];

  selectedPeriod = '';
  selectedRole = '';
  selectedStatus = '';
  keyword = '';

  constructor(private accessLogService: AccessLogService) {}

  ngOnInit(): void {
    this.getAllLogs();
  }

  getAllLogs() {
    this.accessLogService.getAllLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.filteredLogs = data;
      },
      error: () => alert("Loglar getirilemedi.")
    });
  }

  filterByPeriod() {
    if (this.selectedPeriod) {
      this.accessLogService.getLogsByPeriod(this.selectedPeriod).subscribe({
        next: (data) => {
          this.logs = data;
          this.filteredLogs = data;
          this.applyFilters();
        },
        error: () => alert("Zaman filtresi uygulanamadı.")
      });
    } else {
      this.getAllLogs();
    }
  }

  applyFilters() {
    this.filteredLogs = this.logs.filter(log =>
      (!this.selectedRole || log.role === this.selectedRole) &&
      (!this.selectedStatus || log.status === this.selectedStatus) &&
      (!this.keyword || log.endpoint.toLowerCase().includes(this.keyword.toLowerCase()))
    );
  }

  onKeywordChange() {
    this.applyFilters();
  }

  // ✅ CSV Export Fonksiyonu
  exportToCSV() {
    const headers = [
      'ID', 'Zaman', 'Email', 'Rol', 'Endpoint', 'Method',
      'Entity', 'İşlem Tipi', 'Durum', 'Hata Mesajı'
    ];

    const rows = this.filteredLogs.map(log => [
      log.id,
      log.timestamp,
      log.userEmail,
      log.role,
      log.endpoint,
      log.method,
      log.entity,
      log.actionType,
      log.status,
      log.errorMessage || '-'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'access-log.csv';
    link.click();

    window.URL.revokeObjectURL(url);
  }
}
