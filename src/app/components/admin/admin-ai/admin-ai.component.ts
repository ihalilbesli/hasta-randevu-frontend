import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../../service/ai-chat/ai-chat.service';

@Component({
  selector: 'app-admin-ai',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-ai.component.html',
  styleUrl: './admin-ai.component.css'
})
export class AdminAiComponent {

   result: string = '';
  loading: boolean = false;

  constructor(private aiService: AIService) {}

  runAnalysis(type: string) {
    this.result = '';
    this.loading = true;

    let observable;

    switch (type) {
      case 'complaints':
        observable = this.aiService.analyzeComplaintsForAdmin();
        break;
      case 'clinicLoad':
        observable = this.aiService.analyzeClinicLoad();
        break;
      case 'userBehavior':
        observable = this.aiService.analyzeUserBehavior();
        break;
      case 'riskAlerts':
        observable = this.aiService.generateRiskAlerts();
        break;
      default:
        this.result = 'Geçersiz analiz türü.';
        this.loading = false;
        return;
    }

    observable.subscribe({
      next: (data) => {
        this.result = data;
        this.loading = false;
      },
      error: (err) => {
        this.result = '❌ Hata oluştu: ' + (err.error || 'Bilinmeyen hata');
        this.loading = false;
      }
    });
  }
}
