import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicsService {

  private apiUrl = 'http://localhost:8080/hastarandevu/clinics';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
   getAllClinics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getHeaders() });
  }
   getDoctorsByClinicId(clinicId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${clinicId}/doctors`, {
      headers: this.getHeaders()
    });
  }
  createClinic(clinicData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}`, clinicData, {
    headers: this.getHeaders()
  });
}
updateClinic(id: number, updatedClinic: any): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}/${id}`, updatedClinic, {
    headers: this.getHeaders()
  });
}
deactivateClinic(id: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}/passive`, {}, {
    headers: this.getHeaders()
  });
}
activateClinic(id: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl}/${id}/activate`, {}, {
    headers: this.getHeaders()
  });
}





}
