import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ComplaintService } from '../../../service/complaint/complaint.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { AiChatComponent } from '../ai-chat/ai-chat.component';

@Component({
  selector: 'app-complaint-create',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent,AiChatComponent],
  templateUrl: './complaint-create.component.html',
  styleUrl: './complaint-create.component.css'
})
export class ComplaintCreateComponent {
  content = '';
  subject: string = '';
  selectedPeriod = 'all';
  adminNote: string = '';

  complaints: any[] = [];
  userId: number | null = null;

  
  constructor(
    private complaintService: ComplaintService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadComplaints();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }
  onSubmit() {
    if (!this.userId) return;

    const complaint = {
      user: { id: this.userId },
      subject: this.subject,
      content: this.content
    };

    this.complaintService.createComplaint(complaint).subscribe({
      next: () => {
        alert('Şikayet gönderildi.');
        this.content = '';
        this.loadComplaints();
      },
      error: (err) => console.error('Şikayet oluşturulamadı:', err)
    });
  }

  loadComplaints() {
    if (!this.userId) return;

    if (this.selectedPeriod === 'all') {
      this.complaintService.getComplaintsByUserId(this.userId).subscribe({
        next: (data) => (this.complaints = data),
        error: (err) => console.error('Şikayetler alınamadı:', err)
      });
    } else {
      this.complaintService.getComplaintsByPeriod(this.userId, this.selectedPeriod).subscribe({
        next: (data) => (this.complaints = data),
        error: (err) => console.error('Filtreli şikayetler alınamadı:', err)
      });
    }
  }
}
