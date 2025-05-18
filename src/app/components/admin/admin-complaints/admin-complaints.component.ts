import { Component } from '@angular/core';
import { ComplaintService } from '../../../service/complaint/complaint.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './admin-complaints.component.html',
  styleUrl: './admin-complaints.component.css'
})
export class AdminComplaintsComponent {
  complaints: any[] = [];
  filteredComplaints: any[] = [];

  statusFilter: string = '';
  searchKeyword: string = '';

  editingComplaintId: number | null = null;
  updatedStatus: string = '';
  updatedNote: string = '';

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.getAllComplaints();
  }

  getAllComplaints() {
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        console.log('📦 Admin JSON Şikayet Verisi:', data); 
        this.complaints = data;
        this.filteredComplaints = data;
      },
      error: () => alert('Şikayetler getirilemedi.')
    });
  }

  filterComplaints() {
  if (this.statusFilter) {
    this.complaintService.getComplaintsByStatus(this.statusFilter).subscribe({
      next: (data) => {
        this.complaints = data;
        this.filteredComplaints = this.applyKeywordFilter(this.complaints);
      },
      error: () => alert('Duruma göre şikayetler getirilemedi.')
    });
  } else {
    // Tüm şikayetleri çekip arama filtresi de uygula
    this.complaintService.getAllComplaints().subscribe({
      next: (data) => {
        this.complaints = data;
        this.filteredComplaints = this.applyKeywordFilter(this.complaints);
      },
      error: () => alert('Şikayetler getirilemedi.')
    });
  }
}
applyKeywordFilter(data: any[]): any[] {
  if (!this.searchKeyword) return data;
  return data.filter(c =>
    (c.user?.name + ' ' + c.user?.surname).toLowerCase().includes(this.searchKeyword.toLowerCase())
  );
}


  startEditing(complaint: any) {
    this.editingComplaintId = complaint.id;
    this.updatedStatus = complaint.status;
    this.updatedNote = complaint.adminNote || '';
  }

  cancelEdit() {
    this.editingComplaintId = null;
    this.updatedStatus = '';
    this.updatedNote = '';
  }

  saveEdit(complaintId: number) {
   if (!this.updatedStatus) {
    alert("Lütfen bir durum seçin.");
    return;
  }

  // Eğer durum 'COZULDU' ise admin notu zorunlu
  if (this.updatedStatus === 'COZULDU' && this.updatedNote.trim() === '') {
    alert("Durum 'Çözüldü' seçildiyse, lütfen bir admin notu girin.");
    return;
  }

  const existing = this.complaints.find(c => c.id === complaintId);
  const updated = {
    content: existing.content,
    status: this.updatedStatus,
    adminNote: this.updatedNote
  };

  this.complaintService.updateComplaint(complaintId, updated).subscribe({
    next: () => {
      alert('Şikayet güncellendi.');
      this.getAllComplaints();
      this.cancelEdit();
    },
    error: () => alert('Güncelleme başarısız.')
  });//
  }
}
