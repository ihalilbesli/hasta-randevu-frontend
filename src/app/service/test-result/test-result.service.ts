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
    // 3. Doktor id'sine göre test sonuçlarını getir
    getTestResultsByDoctorId(doctorId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/doctor/${doctorId}`, {
        headers: this.getHeaders()
      });
    }
  
    // 4. Doktor id'sine ve zamana göre test sonuçlarını getir
    getTestResultsByDoctorAndPeriod(doctorId: number, period: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/doctor/${doctorId}/filter?period=${period}`, {
        headers: this.getHeaders()
      });
    }
  
    // 5. Tüm test sonuçlarını getir (admin için)
    getAllTestResults(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}`, {
        headers: this.getHeaders()
      });
    }
  
    // 6. Yeni test sonucu oluştur
    createTestResult(testResultData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}`, testResultData, {
        headers: this.getHeaders()
      });
    }
  
    // 7. Test sonucu güncelle (opsiyonel)
    updateTestResult(id: number, updatedData: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${id}`, updatedData, {
        headers: this.getHeaders()
      });
    }
  
    // 8. Test sonucu sil (opsiyonel)
    deleteTestResult(id: number): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`, {
        headers: this.getHeaders()
      });
    }
    
}
