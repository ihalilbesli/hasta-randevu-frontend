import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../../service/ai-chat/ai-chat.service';
import { ClinicsService } from '../../../service/clinics/clinics.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent implements OnInit {
  isOpen = false;
  complaintText = '';
  isLoading = false;
  response: string | null = null;
  suggestedClinic: string | null = null;
  readonly: boolean = false;

  clinics: any[] = [];

  constructor(
    private aiService: AIService,
    private clinicService: ClinicsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clinicService.getAllClinics().subscribe({
      next: (data) => this.clinics = data,
      error: () => console.error('Klinikler alınamadı.')
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  submitComplaint() {
    if (!this.complaintText.trim()) return;

    this.isLoading = true;
    this.response = null;
    this.suggestedClinic = null;
    this.readonly = true;

    this.aiService.analyzeComplaint(this.complaintText).subscribe({
      next: (res) => {
        this.response = res;

        const match = res.match(/Poliklinik:\s*(.*)/);
        const suggested = match ? match[1].trim() : null;

        // Sistemdeki kliniklerle eşleştir
        const matchedClinic = this.clinics.find(c => c.name === suggested);
        this.suggestedClinic = matchedClinic ? matchedClinic.name : null;

        if (!this.suggestedClinic) {
          this.response += '\n\n Not: Önerilen klinik sistemde bulunamadı.';
        }

        this.isLoading = false;
      },
      error: () => {
        this.response = "Yapay zeka şu anda yanıt veremiyor.";
        this.isLoading = false;
      }
    });
  }

  goToAppointment() {
    if (this.suggestedClinic) {
      this.router.navigate(['/appointment-create'], {
        queryParams: { clinic: this.suggestedClinic }
      });
    }
  }

  reset() {
    this.complaintText = '';
    this.response = null;
    this.suggestedClinic = null;
    this.readonly = false;
  }
}
