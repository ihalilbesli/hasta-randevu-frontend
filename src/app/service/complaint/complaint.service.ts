import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private apiUrl = 'http://localhost:8080/hastarandevu/complaints';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createComplaint(complaint: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, complaint, {
      headers: this.getHeaders()
    });
  }

  getComplaintsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getComplaintsByPeriod(userId: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/filter?userId=${userId}&period=${period}`,
      {
        headers: this.getHeaders()
      }
    );
  }
  // ✅ Tüm şikayetleri getir (Admin)
  getAllComplaints(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Duruma göre şikayetleri getir (Admin veya Doktor)
  getComplaintsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status?status=${status}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Şikayet güncelle (status + adminNote)
  updateComplaint(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData, {
      headers: this.getHeaders()
    });
  }

  // ✅ Şikayet sil (Admin)
  deleteComplaint(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
