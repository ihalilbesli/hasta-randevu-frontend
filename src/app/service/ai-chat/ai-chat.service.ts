import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private baseUrl  = 'http://localhost:8080/hastarandevu/ai';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  analyzeComplaint(complaintText: string): Observable<string> {
  return this.http.post(`${this.baseUrl}/analyze`, { complaintText }, {
    headers: this.getHeaders(),
    responseType: 'text' 
  });
}
  // 2️⃣ Admin: Şikayetlerden klinik önerisi ve analiz
  analyzeComplaintsForAdmin(): Observable<string> {
    return this.http.get(`${this.baseUrl}/admin/analyze-complaints`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  // 3️⃣ Admin: Klinik yoğunluğu analizi
  analyzeClinicLoad(): Observable<string> {
    return this.http.get(`${this.baseUrl}/admin/analyze-clinic-load`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

 

  // 5️⃣ Admin: Kullanıcı davranış analizi
  analyzeUserBehavior(): Observable<string> {
    return this.http.get(`${this.baseUrl}/admin/analyze-user-behavior`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  // 6️⃣ Admin: Riskli durumları ve erken uyarıları getir
  generateRiskAlerts(): Observable<string> {
    return this.http.get(`${this.baseUrl}/admin/risk-alerts`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

}
