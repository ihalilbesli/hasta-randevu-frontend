import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = 'http://localhost:8080/hastarandevu/appointments';
  
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
   //  Tüm randevuları getir
   getAllAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, { headers: this.getHeaders() });
  }

  //  ID ile randevu getir
  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  //  Yeni randevu oluştur
  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, appointmentData, { headers: this.getHeaders() });
  }

  // Randevu sil
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Doktora göre randevular
  getAppointmentsByDoctorId(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`, { headers: this.getHeaders() });
  }

  //  Uygun randevular 
  getAvailableAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`, { headers: this.getHeaders() });
  }
}
