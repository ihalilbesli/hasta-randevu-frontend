import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../../service/ai-chat/ai-chat.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './ai-chat.component.html',
  styleUrl: './ai-chat.component.css'
})
export class AiChatComponent {
  isOpen = false;
  complaintText = '';
  isLoading = false;
  response: string | null = null;
  suggestedClinic: string | null = null;
  readonly: boolean = false; 
  constructor(private aiService: AIService, private router: Router) {}

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
        this.suggestedClinic = match ? match[1].trim() : null;
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
