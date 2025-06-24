import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { ComplaintService } from '../../../service/complaint/complaint.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { AiChatComponent } from '../ai-chat/ai-chat.component';
import { ClinicsService } from '../../../service/clinics/clinics.service';
import { ToastrService } from 'ngx-toastr'; // 🔥 Toastr import

@Component({
  selector: 'app-complaint-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, AiChatComponent],
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

  clinics: any[] = [];
  selectedClinicId: number | null = null;

  konuListesi = [
    'Randevu Sorunu',
    'Klinikle İlgili Sorun',
    'Sistemsel Sorun',
    'Diğer'
  ];

  constructor(
    private complaintService: ComplaintService,
    private userService: UserService,
    private clinicsService: ClinicsService,
    private toastr: ToastrService // ✅ ToastrService enjekte edildi
  ) {}

  get placeholderText(): string {
    switch (this.subject) {
      case 'Randevu Sorunu':
        return 'Randevu alamama, iptal, gecikme gibi detayları yazınız.';
      case 'Klinikle İlgili Sorun':
        return 'Klinikte yaşadığınız yönlendirme/karışıklık gibi sorunu yazınız.';
      case 'Sistemsel Sorun':
        return 'Sayfa açılmıyor, hata alıyorum gibi teknik sorunları yazınız.';
      default:
        return 'Yaşadığınız problemi detaylı bir şekilde açıklayın.';
    }
  }

  get showClinicSelect(): boolean {
    return this.subject === 'Klinikle İlgili Sorun';
  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadComplaints();
      },
      error: (err) => {
        console.error('Kullanıcı alınamadı:', err);
        this.toastr.error('Kullanıcı bilgileri alınamadı.');
      }
    });

    this.clinicsService.getAllClinics().subscribe({
      next: (data) => (this.clinics = data),
      error: () => this.toastr.error('Klinikler alınamadı.')
    });
  }

  onSubmit() {
    if (!this.userId) return;

    const complaint: any = {
      user: { id: this.userId },
      subject: this.subject,
      content: this.content
    };
    if (this.selectedClinicId) {
      complaint.clinic = { id: this.selectedClinicId };
    }

    this.complaintService.createComplaint(complaint).subscribe({
      next: () => {
        this.toastr.success('Şikayet başarıyla gönderildi.');
        this.content = '';
        this.subject = '';
        this.selectedClinicId = null;
        this.loadComplaints();
      },
      error: () => this.toastr.error('Şikayet oluşturulamadı.')
    });
  }

  loadComplaints() {
    if (!this.userId) return;

    const handler = {
      next: (data: any[]) => (this.complaints = data),
      error: () => this.toastr.error('Şikayetler alınamadı.')
    };

    if (this.selectedPeriod === 'all') {
      this.complaintService.getComplaintsByUserId(this.userId).subscribe(handler);
    } else {
      this.complaintService.getComplaintsByPeriod(this.userId, this.selectedPeriod).subscribe({
        next: (data) => (this.complaints = data),
        error: () => this.toastr.error('Filtreli şikayetler alınamadı.')
      });
    }
  }
}
