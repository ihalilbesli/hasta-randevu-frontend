import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientHistoryService {
  private apiUrl = 'http://localhost:8080/hastarandevu/patient-history';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
  getHistoriesByPatientId(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`, {
      headers: this.getHeaders()
    });
  }

  getHistoriesByPeriod(patientId: number, period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }

  searchByDiagnosis(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/diagnosis?keyword=${keyword}`, {
      headers: this.getHeaders()
    });
  }

  searchByTreatment(keyword: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search/treatment?keyword=${keyword}`, {
      headers: this.getHeaders()
    });
  }
}
