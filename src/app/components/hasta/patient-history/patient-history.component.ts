import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { PatientHistoryService } from '../../../service/patient-history/patient-history.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { AiChatComponent } from '../ai-chat/ai-chat.component';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent,AiChatComponent],
  templateUrl: './patient-history.component.html',
  styleUrl: './patient-history.component.css'
})
export class PatientHistoryComponent {
  patientId: number | null = null;
  histories: any[] = [];
  filteredHistories: any[] = [];

  selectedPeriod = 'all';
  searchKeyword = '';
  searchField: 'diagnosis' | 'treatment' = 'diagnosis';

  constructor(
    private patientHistoryService: PatientHistoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.loadHistories();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }
  loadHistories() {
    if (!this.patientId) return;

    if (this.selectedPeriod === 'all') {
      this.patientHistoryService.getHistoriesByPatientId(this.patientId).subscribe({
        next: (data) => (this.filteredHistories = this.histories = data),
        error: (err) => console.error('Geçmiş alınamadı:', err)
      });
    } else {
      this.patientHistoryService.getHistoriesByPeriod(this.patientId, this.selectedPeriod).subscribe({
        next: (data) => (this.filteredHistories = this.histories = data),
        error: (err) => console.error('Filtrelenmiş geçmiş alınamadı:', err)
      });
    }
  }
  search() {
    if (!this.searchKeyword.trim()) {
      this.filteredHistories = this.histories;
      return;
    }

    const serviceCall =
      this.searchField === 'diagnosis'
        ? this.patientHistoryService.searchByDiagnosis(this.searchKeyword)
        : this.patientHistoryService.searchByTreatment(this.searchKeyword);

    serviceCall.subscribe({
      next: (data) => (this.filteredHistories = data),
      error: (err) => console.error('Arama başarısız:', err)
    });
  }

}
