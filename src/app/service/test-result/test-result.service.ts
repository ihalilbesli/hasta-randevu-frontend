import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TestResultService {

  private apiUrl = 'http://localhost:8080/hastarandevu/test-result';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Giriş yapan hastanın test sonuçları
  getTestResultsByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`, {
      headers: this.getHeaders()
    });
  }

  // Belirli zaman aralığına göre (day, week, month, year)
  getTestResultsByPatientAndPeriod(patientId: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }
}
