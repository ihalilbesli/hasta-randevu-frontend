import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/hastarandevu/auth';

  constructor(private http:HttpClient,private router:Router) { }


    // Giriş
  login(email:string,password:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,{email,password});
  }
   // Kayıt
  register(user:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/register`, user);
  }
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
  // Giriş yapmış mı?
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  // Token alma
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // JWT içeriğini decode eden  yöntem
  public decodeToken(token:string):any{
    try{
      const payload=token.split(".")[1];
      const decoded=atob(payload);
      return JSON.parse(decoded);
    }catch(error){
      console.error('Token decode hatası:', error);
    return null;
    }
  }
  // Kullanıcının email bilgisini döndürür
getUserEmail(): string | null {
  const token = this.getToken();
  if (!token) return null;
  const decoded = this.decodeToken(token);
  return decoded?.sub || null;  // sub email 
}

  getUserRole():string|null{
    const token = this.getToken();
  if (!token) return null;
  const decoded = this.decodeToken(token);
  return decoded?.role || null;
  }
}
