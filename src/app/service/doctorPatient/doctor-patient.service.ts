import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorPatientService {
  private apiUrl = 'http://localhost:8080/hastarandevu/doctorPatients';
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  getMyPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-patients`, {
      headers: this.getHeaders()
    });
  }

  searchMyPatientsByName(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-patients/search-by-name?name=${name}`, {
      headers: this.getHeaders()
    });
  }

  searchMyPatientsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-patients/search-by-email?email=${email}`, {
      headers: this.getHeaders()
    });
  }
  getMyPatientsToday(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-patients-today`, {
      headers: this.getHeaders()
    });
  }
  getMyPatientsTodayFull(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-patients-today-full`, {
      headers: this.getHeaders()
    });
  }


}
