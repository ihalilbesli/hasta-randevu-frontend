import { Component } from '@angular/core';
import { AnalyticsService } from '../../../../service/analytics/analytics.service';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-users-analytics',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './users-analytics.component.html',
  styleUrl: './users-analytics.component.css'
})
export class UsersAnalyticsComponent {


  constructor(private analyticsService: AnalyticsService) {}
  // 1. Kullanıcı Rol Dağılımı
  roleLabels: string[] = [];
  roleData: number[] = [];

  // 2. Cinsiyet Dağılımı
  genderLabels: string[] = [];
  genderData: number[] = [];

  // 3. Kan Grubu Dağılımı
  bloodLabels: string[] = [];
  bloodData: number[] = [];

  // 4. Kliniklere Göre Doktor Sayısı
  clinicLabels: string[] = [];
  clinicDoctorData: number[] = [];

  ngOnInit(): void {
    this.loadUserRoles();
    this.loadGenderDistribution();
    this.loadBloodTypeDistribution();
    this.loadDoctorCountByClinic();
  }

 loadUserRoles() {
  this.analyticsService.getUserCountByRole().subscribe(data => {
    console.log('📊 Rol Verisi:', data);
    this.roleLabels = data.map(d => d.role);
    this.roleData = data.map(d => d.count);
    console.log('📋 Role Labels:', this.roleLabels);
    console.log('📈 Role Data:', this.roleData);
  });
}

loadGenderDistribution() {
  this.analyticsService.getUserCountByGender().subscribe(data => {
    console.log('⚧️ Cinsiyet Verisi:', data);
    this.genderLabels = data.map(d => d.gender);
    this.genderData = data.map(d => d.count);
    console.log('📋 Gender Labels:', this.genderLabels);
    console.log('📈 Gender Data:', this.genderData);
  });
}

loadBloodTypeDistribution() {
  this.analyticsService.getUserCountByBloodType().subscribe(data => {
    console.log('🩸 Kan Grubu Verisi:', data);
    this.bloodLabels = data.map(d => d.bloodType);
    this.bloodData = data.map(d => d.count);
    console.log('📋 Blood Labels:', this.bloodLabels);
    console.log('📈 Blood Data:', this.bloodData);
  });
}

loadDoctorCountByClinic() {
  this.analyticsService.getDoctorCountByClinic().subscribe(data => {
    console.log('🏥 Klinik Doktor Verisi:', data);
    this.clinicLabels = data.map(d => d.clinicName);
    this.clinicDoctorData = data.map(d => d.count);
    console.log('📋 Klinik Labels:', this.clinicLabels);
    console.log('📈 Klinik Data:', this.clinicDoctorData);
  });
}


}
