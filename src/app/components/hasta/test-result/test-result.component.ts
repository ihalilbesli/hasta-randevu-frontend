import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user-service/user-service.service';
import { TestResultService } from '../../../service/test-result/test-result.service';
import { HeaderComponent } from '../../header/header.component';
import { AiChatComponent } from '../ai-chat/ai-chat.component';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule,FormsModule,AiChatComponent],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css'
})
export class TestResultComponent {
  allResults: any[] = [];
  filteredResults: any[] = [];
  patientId: number | null = null;

  selectedPeriod: string = 'all';

  constructor(
    private userService: UserService,
    private testResultService: TestResultService
  ) {}
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.patientId = user.id;
        this.fetchResults();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }
  fetchResults(): void {
    if (!this.patientId) return;

    if (this.selectedPeriod === 'all') {
      this.testResultService.getTestResultsByPatientId(this.patientId).subscribe({
        next: (data) => this.filteredResults = data,
        error: (err) => console.error('Tüm test sonuçları alınamadı:', err)
      });
    } else {
      this.testResultService.getTestResultsByPatientAndPeriod(this.patientId, this.selectedPeriod).subscribe({
        next: (data) => this.filteredResults = data,
        error: (err) => console.error('Filtreli test sonuçları alınamadı:', err)
      });
    }
  }
}
