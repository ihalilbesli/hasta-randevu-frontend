import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../../header/header.component';
import { AnalyticsService } from '../../../../service/analytics/analytics.service';
import { NgChartsModule } from 'ng2-charts'; //grafik modulu
import { ClinicsService } from '../../../../service/clinics/clinics.service';
import { AIService } from '../../../../service/ai-chat/ai-chat.service';


@Component({
  selector: 'app-appointment-analytics',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
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

  // AI yorumları ve yüklenme durumları için iki obje
aiCommentMap: { [key: string]: string } = {};
loadingMap: { [key: string]: boolean } = {};

  constructor(
    private analyticsService: AnalyticsService,
    private clinicsService:ClinicsService, 
    private aiService: AIService) {}

  ngOnInit(): void {
    this.loadClinicData();
    this.loadDateData();
    this.loadStatusData();
    this.loadDoctorData();
  }

loadClinicData() {
  this.clinicsService.getAllClinics().subscribe(clinics => {
    const allClinicNames = clinics.map(c => c.name);
    this.analyticsService.getAppointmentCountByClinic().subscribe(data => {
      const map = new Map(data.map(d => [d.clinicName, d.appointmentCount]));
      this.clinicLabels = allClinicNames;
      this.clinicData = allClinicNames.map(name => map.get(name) || 0);
    });
  });
}


loadDateData() {
  this.analyticsService.getAppointmentCountByDate().subscribe(data => {
    if (data.length === 0) return;

    // Mevcut verileri Map'e çevir
    const countMap = new Map(data.map(d => [d.date, d.appointmentCount]));

    const start = new Date(data[0].date);
    const end = new Date(data[data.length - 1].date);
    const dateList: string[] = [];
    const countList: number[] = [];

    const current = new Date(start);
    while (current <= end) {
      const iso = current.toISOString().slice(0, 10);
      dateList.push(iso);
      countList.push(countMap.get(iso) || 0);
      current.setDate(current.getDate() + 1);
    }

    this.dateLabels = dateList;
    this.dateData = countList;
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
getAiComment(chartKey: string, chartTitle: string, labels: string[], values: number[]) {
  this.loadingMap[chartKey] = true;

  this.aiService.analyzeGraph(chartTitle, labels, values).subscribe({
    next: (result) => {
      this.aiCommentMap[chartKey] = result;
      this.loadingMap[chartKey] = false;
    },
    error: () => {
      this.aiCommentMap[chartKey] = '❌ Yorum alınamadı.';
      this.loadingMap[chartKey] = false;
    }
  });
}
}
