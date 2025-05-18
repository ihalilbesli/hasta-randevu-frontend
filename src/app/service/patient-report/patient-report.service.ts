import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientReportService {
  private apiUrl = 'http://localhost:8080/hastarandevu/patient-report';  
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

  // 1. Hastaya ait raporlar
  getReportsByPatientId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 2. Hastaya ait zaman filtresi
  getReportsByPatientAndPeriod(id: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${id}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }

  // 3. Rapor türü içinde arama
  searchByKeyword(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`, {
      headers: this.getHeaders()
    });
  }

  // 4. Doktorun kendi raporları
  getReportsByDoctorId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor/${id}`, {
      headers: this.getHeaders()
    });
  }

  // 5. Doktorun raporları - zaman filtresi
  getReportsByDoctorAndPeriod(id: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctor/${id}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }

  // 6. Yeni rapor oluştur
  createReport(reportData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, reportData, {
      headers: this.getHeaders()
    });
  }

  // 7. Rapor güncelle
  updateReport(id: number, updatedData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, updatedData, {
      headers: this.getHeaders()
    });
  }

  // 8. Rapor sil
  deleteReport(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  getAllReports(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`, {
    headers: this.getHeaders()
  });
}

}
