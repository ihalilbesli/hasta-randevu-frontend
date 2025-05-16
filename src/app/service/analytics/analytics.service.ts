import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
 private apiUrl = 'http://localhost:8080/hastarandevu/analytics';
  constructor(
    private http:HttpClient,
    private authService:AuthService) { }

   private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }  
  getAppointmentCountByClinic(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/clinic`, { headers: this.getHeaders() });
  }

  getAppointmentCountByDate(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/date`, { headers: this.getHeaders() });
  }

  getAppointmentCountByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/status`, { headers: this.getHeaders() });
  }

  getAppointmentCountByDoctor(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/doctor`, { headers: this.getHeaders() });
  }

  getComplaintCountByStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/complaints/status`, { headers: this.getHeaders() });
  }

  getComplaintCountByClinic(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/complaints/clinic`, { headers: this.getHeaders() });
  }

  getAppointmentCountByTimeSlot(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/time-slot`, { headers: this.getHeaders() });
  }
  // Kullanıcı rol dağılımı (HASTA, DOKTOR, ADMIN)
getUserCountByRole(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/users/roles`, { headers: this.getHeaders() });
}

// Cinsiyet dağılımı (ERKEK, KADIN, BELIRTILMEMIS)
getUserCountByGender(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/users/genders`, { headers: this.getHeaders() });
}

// Kan grubu dağılımı (ARH_POS, ORH_NEG vs.)
getUserCountByBloodType(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/users/blood-types`, { headers: this.getHeaders() });
}

// Kliniklere göre doktor sayısı
getDoctorCountByClinic(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/clinics/doctor-count`, { headers: this.getHeaders() });
}


}
