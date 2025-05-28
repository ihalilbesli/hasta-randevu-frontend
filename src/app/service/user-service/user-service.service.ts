import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient,private authService:AuthService) { }

  private apiUrl="http://localhost:8080/hastarandevu/users";
 
  private getHeaders():HttpHeaders{
    const token=this.authService.getToken();
    return new HttpHeaders({
       "Authorization": `Bearer ${token}`
    })
  }
 
  getCurrentUser(): Observable<any> {
    const email = this.authService.getUserEmail();
    return this.http.get(`${this.apiUrl}/email/${email}`, {
      headers: this.getHeaders()
    });
  }
  getUserByEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/email/${email}`, {
      headers: this.getHeaders()
    });
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getUsersByRole(role: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/role/${role}`, {
      headers: this.getHeaders()
    });
  }

  getUsersByGender(gender: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/gender/${gender}`, {
      headers: this.getHeaders()
    });
  }

  getUsersByName(name: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/name/${name}`, {
      headers: this.getHeaders()
    });
  }

  getUsersByPhone(phoneNumber: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/phone/${phoneNumber}`, {
      headers: this.getHeaders()
    });
  }

  getUsersBySpecialization(specialization: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/specialization/${specialization}`, {
      headers: this.getHeaders()
    });
  }

  getUsersByBloodType(bloodType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/blood-type/${bloodType}`, {
      headers: this.getHeaders()
    });
  }
  getAllPatients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/patients`, { headers: this.getHeaders() });
  }
  deleteUserById(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
  updateUser(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${user.id}`, user, {
      headers: this.getHeaders()
    });
  }
  create(user: any): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post(`http://localhost:8080/hastarandevu/auth/register`, user, {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    });
  }
  getAllUsers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`, {
    headers: this.getHeaders()
  });
}
getProfile(): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/me`, {
    headers: this.getHeaders()
  });
}
updateProfile(profileData: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/profile/me`, profileData, {
    headers: this.getHeaders()
  });
}
changePassword(oldPassword: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/profile/change-password`, {
    oldPassword,
    newPassword
  }, {
    headers: this.getHeaders()
  });
}



  
}