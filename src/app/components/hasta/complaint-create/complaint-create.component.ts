import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ComplaintService } from '../../../service/complaint/complaint.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ClinicsService } from '../../../service/clinics/clinics.service';

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

  clinics: any[] = []; // Klinik listesi
  selectedClinicId: number | null = null; // Seçilen klinik ID'si

  konuListesi = [
  'Randevu Sorunu',
  'Klinikle İlgili Sorun',
  'Sistemsel Sorun',
  'Diğer'
];
get placeholderText(): string {
  switch (this.subject) {
    case 'Randevu Sorunu':
      return 'Randevu alamama, iptal, gecikme gibi detayları yazınız.';  
    case 'Klinikle İlgili Sorun':
      return 'Klinikte yaşadığınız yönlendirme/karışıklık gibi sorunu yazınız.';
    case 'Sistemsel Sorun':
      return 'Sayfa açılmıyor, hata alıyorum gibi teknik sorunları yazınız.';
    case 'Diğer':
    default:
      return 'Yaşadığınız problemi detaylı bir şekilde açıklayın.';
  }
}

// Klinik seçimi sadece "Klinikle İlgili Sorun" seçilirse gösterilecek
get showClinicSelect(): boolean {
  return this.subject === 'Klinikle İlgili Sorun';
}
  
  constructor(
    private complaintService: ComplaintService,
    private userService: UserService,
    private clinicsService: ClinicsService
  ) {}
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadComplaints();
      },
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
     // Klinik verisini al
    this.clinicsService.getAllClinics().subscribe({
      next: (data) => (this.clinics = data),
      error: (err) => console.error('Klinikler alınamadı:', err)
    });
  }
  onSubmit() {
    if (!this.userId) return;

    const complaint :any= {
      user: { id: this.userId },
      subject: this.subject,
      content: this.content
    };
     if (this.selectedClinicId) {
      complaint.clinic = { id: this.selectedClinicId };
    }

    this.complaintService.createComplaint(complaint).subscribe({
      next: () => {
        alert('Şikayet gönderildi.');
        this.content = '';
        this.subject = '';
        this.selectedClinicId = null;
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
