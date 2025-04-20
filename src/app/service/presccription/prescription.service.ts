import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  private apiUrl = 'http://localhost:8080/hastarandevu/prescriptions';

  constructor(
    private http:HttpClient,
    private authService:AuthService
  ) { }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  // 1. Giriş yapan hastanın reçeteleri
  getPrescriptionsByPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`, {
      headers: this.getHeaders()
    });
  }
   // 2. Tarih filtreli reçeteler (day, week, month, year)
   getPrescriptionsByPeriod(patientId: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }
   // 3. Açıklamada arama
   searchPrescriptions(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`, {
      headers: this.getHeaders()
    });
  }

  // 4. Reçeteyi detaylı gör
  getPrescriptionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
