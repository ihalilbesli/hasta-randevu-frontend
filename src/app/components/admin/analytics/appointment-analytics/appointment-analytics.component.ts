import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { AnalyticsService } from '../../../../service/analytics/analytics.service';
import { NgChartsModule } from 'ng2-charts'; //grafik modulu


@Component({
  selector: 'app-appointment-analytics',
  standalone: true,
  imports: [CommonModule,HeaderComponent,NgChartsModule],
  templateUrl: './appointment-analytics.component.html',
  styleUrl: './appointment-analytics.component.css'
})
export class AppointmentAnalyticsComponent {
  clinicLabels: string[] = [];
  clinicData: number[] = [];

  dateLabels: string[] = [];
  dateData: number[] = [];

  statusLabels = ['AKTIF', 'IPTAL_EDILDI', 'COMPLETED', 'GEC_KALINDI'];
  statusData: number[] = [];

  doctorLabels: string[] = [];
  doctorData: number[] = [];

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadClinicData();
    this.loadDateData();
    this.loadStatusData();
    this.loadDoctorData();
  }

loadClinicData() {
  this.analyticsService.getAppointmentCountByClinic().subscribe(data => {
      this.clinicLabels = data.map(d => d.clinicName);
    this.clinicData = data.map(d => d.appointmentCount);
  });
}

 loadDateData() {
  this.analyticsService.getAppointmentCountByDate().subscribe(data => {
    this.dateLabels = data.map(d => d.date);
    this.dateData = data.map(d => d.appointmentCount);
  });
}

  loadStatusData() {
  this.analyticsService.getAppointmentCountByStatus().subscribe(data => {
    this.statusData = new Array(this.statusLabels.length).fill(0);
    data.forEach(d => {
      const idx = this.statusLabels.indexOf(d.status);
   
      if (idx !== -1) this.statusData[idx] = d.count;
    });
  
  });
}

 loadDoctorData() {
  this.analyticsService.getAppointmentCountByDoctor().subscribe(data => {
    this.doctorLabels = data.map(d => d.doctorName);
    this.doctorData = data.map(d => d.appointmentCount);
  });
}
}
