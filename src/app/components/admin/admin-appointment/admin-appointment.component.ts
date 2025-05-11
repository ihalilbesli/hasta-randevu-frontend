import { Component } from '@angular/core';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-admin-appointment',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './admin-appointment.component.html',
  styleUrl: './admin-appointment.component.css'
})
export class AdminAppointmentComponent {
appointments: any[] = [];
  filteredAppointments: any[] = [];

  selectedPeriod = '';
  selectedStatus = '';
  keyword = '';

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.getAllAppointments();
  }

  getAllAppointments() {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data;
      },
      error: () => alert("Randevular getirilemedi.")
    });
  }

  filterByPeriod() {
  if (this.selectedPeriod) {
    this.appointmentService.getAppointmentsByPeriod(this.selectedPeriod).subscribe({
      next: (data) => {
        this.appointments = data;
        this.filteredAppointments = data; 
        this.filterByStatus(); 
      },
      error: () => alert("Zaman aralığına göre randevular getirilemedi.")
    });
  } else {
    this.getAllAppointments();
  }
}

  filterByStatus() {
    this.filteredAppointments = this.appointments.filter(a => 
      !this.selectedStatus || a.status === this.selectedStatus
    );
    this.applyKeywordFilter();
  }

  applyKeywordFilter() {
    this.filteredAppointments = this.filteredAppointments.filter(a =>
      a.description?.toLowerCase().includes(this.keyword.toLowerCase())
    );
  }

  onKeywordChange() {
    this.filterByStatus(); // status filtreli listeyi tekrar keyword'e göre filtrele
  }
}
