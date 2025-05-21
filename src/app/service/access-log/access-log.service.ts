import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccessLogService {
  private apiUrl = 'http://localhost:8080/hastarandevu/acces-log';

  constructor(
    private http: HttpClient, 
    private authService: AuthService
  ) {}
   private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
   // Tüm logları getir
  getAllLogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, {
      headers: this.getHeaders()
    });
  }

  // Emaile göre log getir
  getLogsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/email/${email}`, {
      headers: this.getHeaders()
    });
  }

  // Role göre log getir
  getLogsByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/role/${role}`, {
      headers: this.getHeaders()
    });
  }

  // Statüye göre log getir
  getLogsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/status/${status}`, {
      headers: this.getHeaders()
    });
  }

  // Zaman filtresine göre log getir (day, week, month, year)
  getLogsByPeriod(period: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/filter?period=${period}`, {
      headers: this.getHeaders()
    });
  }
}
