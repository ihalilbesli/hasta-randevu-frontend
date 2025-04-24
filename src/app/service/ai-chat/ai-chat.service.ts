import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  private apiUrl = 'http://localhost:8080/hastarandevu/ai/analyze';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  analyzeComplaint(complaintText: string): Observable<string> {
    return this.http.post(this.apiUrl, { complaintText }, {
      headers: this.getHeaders(),
      responseType: 'text' 
    });
  }
}
