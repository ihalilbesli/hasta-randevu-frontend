import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { AnalyticsService } from '../../../../service/analytics/analytics.service';
import { ClinicsService } from '../../../../service/clinics/clinics.service';

@Component({
  selector: 'app-complaints-analytics',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './complaints-analytics.component.html',
  styleUrl: './complaints-analytics.component.css'
})
export class ComplaintsAnalyticsComponent {

   // 1. Şikayet durumları (pie chart için)
  complaintStatusLabels: string[] = ['BEKLEMEDE', 'INCELEMEDE', 'COZULDU'];
  complaintStatusData: number[] = [];

  // 2. Klinik bazlı şikayetler (bar chart için)
  complaintClinicLabels: string[] = [];
  complaintClinicData: number[] = [];

  // 3. Konulara göre şikayet dağılımı
complaintSubjectLabels: string[] = [];
complaintSubjectData: number[] = [];

  constructor(
    private analyticsService: AnalyticsService,
    private clinicsService: ClinicsService
  ) {}

  ngOnInit(): void {
    this.loadComplaintStatusData();
    this.loadAllClinicsThenComplaints();
      this.loadComplaintSubjectData(); // Klinikler ve şikayet verisi eş zamanlı yönetilir
  }

  // Şikayet durumu (status) verisi
  loadComplaintStatusData() {
    this.analyticsService.getComplaintCountByStatus().subscribe(data => {
      console.log('📊 Şikayet Durum Verisi:', data);
      this.complaintStatusData = new Array(this.complaintStatusLabels.length).fill(0);
      data.forEach(d => {
        const idx = this.complaintStatusLabels.indexOf(d.status);
        if (idx !== -1) this.complaintStatusData[idx] = d.count;
      });
      console.log('📈 Şikayet Durum Dağılımı:', this.complaintStatusData);
    });
  }

  // Klinik listesini al ve şikayet verileriyle eşleştir
  loadAllClinicsThenComplaints() {
    this.clinicsService.getAllClinics().subscribe(clinics => {
      const allClinicNames = clinics.map(c => c.name);
      this.analyticsService.getComplaintCountByClinic().subscribe(complaints => {

        const complaintMap = new Map(complaints.map(c => [c.clinicName, c.complaintCount]));

        this.complaintClinicLabels = allClinicNames;
        this.complaintClinicData = allClinicNames.map(name => complaintMap.get(name) || 0);

      });
    });
  }
  loadComplaintSubjectData() {
  this.analyticsService.getComplaintCountBySubject().subscribe(data => {
    console.log('📚 Şikayet Konu Verisi:', data);
    this.complaintSubjectLabels = data.map(d => d.subject);
    this.complaintSubjectData = data.map(d => d.count);
  });
}
}
