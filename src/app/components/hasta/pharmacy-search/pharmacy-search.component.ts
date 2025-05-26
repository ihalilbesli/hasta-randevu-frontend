import { Component } from '@angular/core';
import { PharmacyService } from '../../../service/PharmacyService/pharmacy-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-pharmacy-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pharmacy-search.component.html',
  styleUrl: './pharmacy-search.component.css'
})
export class PharmacySearchComponent {
  cities = [
    { name: 'İstanbul', districts: ['Kadıköy', 'Üsküdar', 'Beşiktaş', 'Bakırköy'] },
    { name: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle'] },
    { name: 'İzmir', districts: ['Konak', 'Karşıyaka', 'Bornova', 'Buca'] },
    { name: 'Bursa', districts: ['Osmangazi', 'Yıldırım', 'Nilüfer', 'Gemlik'] },
    { name: 'Antalya', districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya'] }
  ];

  selectedCity: string = '';
  selectedDistrict: string = '';
  districts: string[] = [];
  pharmacies: any[] = [];

  constructor(
    private pharmacyService: PharmacyService,
    private authService: AuthService
  ) {}

  onCityChange(): void {
    const found = this.cities.find(c => c.name === this.selectedCity);
    this.districts = found ? found.districts : [];
    this.selectedDistrict = ''; // önceki ilçe seçimini sıfırla
  }

  searchPharmacies(): void {
    if (!this.selectedCity) {
      alert('Lütfen bir şehir seçin.');
      return;
    }

    this.pharmacyService.getPharmacies(this.selectedCity, this.selectedDistrict).subscribe({
      next: (data) => {
        this.pharmacies = data;
      },
      error: (err) => {
        console.error('Eczane verisi alınamadı:', err);
        alert('Eczane verisi alınamadı.');
      }
    });
  }
}
