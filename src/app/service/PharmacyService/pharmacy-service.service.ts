import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {
  private apiUrl = 'http://localhost:8080/hastarandevu/eczaneler';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getPharmacies(city: string, district?: string): Observable<any[]> {
    let params = new HttpParams().set('city', city);
    if (district) {
      params = params.set('district', district);
    }

    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }
}
