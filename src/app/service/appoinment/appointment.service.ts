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
    return this.http.get(`${this.apiUrl}`, { 
      headers: this.getHeaders()
     });
  }

  //  ID ile randevu getir
  getAppointmentById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
       headers: this.getHeaders()
      });
  }

  //  Yeni randevu oluştur
  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, appointmentData, { 
      headers: this.getHeaders()
     });
  }

  // Randevu sil
  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  // Doktora göre randevular
  getAppointmentsByDoctorId(doctorId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/doctor/${doctorId}`, {
       headers: this.getHeaders()
       });
  }

  //  Uygun randevular 
  getAvailableAppointments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/available`, { 
      headers: this.getHeaders()
     });
  }

  getAppointmentsByDoctorAndDate(doctorId: number, date: string): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(
      `${this.apiUrl}/doctor/${doctorId}/date?date=${date}`,  { 
        headers: this.getHeaders()
       });
    }
    getAppointmentsByPatientId(patientId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/patient/${patientId}`, {
        headers: this.getHeaders()
      });
    }
    cancelAppointment(id: number): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}/cancel`, {}, {
        headers: this.getHeaders()
      });
    }
    updateAppointmentStatus(id: number, status: string): Observable<any> {
      return this.http.put(`${this.apiUrl}/${id}/status?status=${status}`, {}, {
        headers: this.getHeaders()
      });
    }
    getAppointmentsByPeriod(period: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/filter?period=${period}`, {
    headers: this.getHeaders()
  });
}
countAppointmentsByStatus(status: string): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count?status=${status}`, {
    headers: this.getHeaders()
  });
}
searchAppointmentsByKeyword(keyword: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/search?keyword=${keyword}`, {
    headers: this.getHeaders()
  });
}



    
    
}
