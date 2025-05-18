import { Component } from '@angular/core';
import { AppointmentService } from '../../../../service/appoinment/appointment.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointments-export',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointments-export.component.html',
  styleUrl: './appointments-export.component.css'
})
export class AppointmentsExportComponent {
 appointments: any[] = [];

  constructor(private appointmentService: AppointmentService, private exportService: ExportService) {}

  ngOnInit(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => this.appointments = data,
      error: () => alert("Randevular getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportAppointments().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'appointments.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
