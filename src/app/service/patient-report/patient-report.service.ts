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
     getReportsByPatientId(id: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/patient/${id}`, {
        headers: this.getHeaders()
      });
    }
  
    getReportsByPatientAndPeriod(id: number, period: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/patient/${id}/filter?period=${period}`, {
        headers: this.getHeaders()
      });
    }
  
    searchByKeyword(keyword: string): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`, {
        headers: this.getHeaders()
      });
    }

  }
