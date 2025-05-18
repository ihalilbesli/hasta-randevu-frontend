import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private apiUrl = 'http://localhost:8080/hastarandevu/export';
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
    // Her metot Observable<Blob> döner, çağıran component dosya indirebilir
  exportUsers(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportAppointments(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/appointments`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportComplaints(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/complaints`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportTestResults(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/test-results`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportPrescriptions(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/prescriptions`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportPatientHistories(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/patient-histories`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }

  exportPatientReports(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/patient-reports`, {
      headers: this.getHeaders(),
      responseType: 'blob'
    });
  }
}
