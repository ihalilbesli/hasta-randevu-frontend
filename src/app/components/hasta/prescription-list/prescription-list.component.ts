import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../../service/presccription/prescription.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from '../../header/header.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule,FormsModule,AiChatComponent],
  templateUrl: './prescription-list.component.html',
  styleUrl: './prescription-list.component.css'
})
export class PrescriptionListComponent {
  prescriptions: any[] = [];
  filteredPrescriptions: any[] = [];
  patientId: number | null = null;

  keyword: string = '';
  selectedPeriod: string = 'all';

  constructor(
    private prescriptionService: PrescriptionService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.fetchPrescriptions();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }
  fetchPrescriptions(): void {
    if (!this.patientId) return;

    if (this.selectedPeriod !== 'all') {
      this.prescriptionService.getPrescriptionsByPeriod(this.patientId, this.selectedPeriod).subscribe({
        next: (data) => this.filteredPrescriptions = data,
        error: (err) => console.error('Filtreli reçeteler alınamadı:', err)
      });
    } else {
      this.prescriptionService.getPrescriptionsByPatient(this.patientId).subscribe({
        next: (data) => this.filteredPrescriptions = data,
        error: (err) => console.error('Tüm reçeteler alınamadı:', err)
      });
    }
  }
  search(): void {
    if (!this.keyword) {
      this.fetchPrescriptions();
      return;
    }

    this.prescriptionService.searchPrescriptions(this.keyword).subscribe({
      next: (data) => {
        this.filteredPrescriptions = data.filter(p => p.patient.id === this.patientId);
      },
      error: (err) => console.error('Arama hatası:', err)
    });
  }
}
