import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export default class DoctorService {
  private baseUrl = 'http://localhost:8080/hastarandevu'; 

  constructor(
    private http:HttpClient,
    private authService:AuthService) { }

    private getHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
     // 🩺 Gelen randevular (Doktorun hastalarından gelen randevular)
  getAppointmentsByDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/appointments/doctor/${doctorId}`, {
      headers: this.getHeaders()
    });
  }

  // 🧾 Yazdığı reçeteler
  getPrescriptionsByDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/prescriptions/doctor/${doctorId}`, {
      headers: this.getHeaders()
    });
  }

  // 🧪 Eklediği test sonuçları
  getTestResultsByDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/test-result/doctor/${doctorId}`, {
      headers: this.getHeaders()
    });
  }

  // 📚 Eklediği hasta geçmişleri
  getPatientHistoriesByDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patient-history/doctor/${doctorId}`, {
      headers: this.getHeaders()
    });
  }

  // 📄 Eklediği hasta raporları
  getPatientReportsByDoctor(doctorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patient-report/doctor/${doctorId}`, {
      headers: this.getHeaders()
    });
  }
}
