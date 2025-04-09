import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private authService:AuthService,
    private router:Router
  ){}

      email:string="";
      password:string="";

      onlogin(){
        console.log("email :",this.email);
        console.log("Sifre :",this.password)
      }
      onSubmit(){
      this.authService.login(this.email,this.password).subscribe({
        next:(response:any)=>{
          console.log("📦 Backend'den gelen token (ham hali):",response);
          const token = response.token; 
          localStorage.setItem('jwtToken', token);

          // Token'ı decode ediyoruz
          const decoded=this.authService.decodeToken(token)
          console.log("🔍 Çözülmüş token içeriği:", decoded);

       
          localStorage.setItem('userRole', decoded?.role || "");

          if(decoded?.role==="HASTA"){
         //   this.router.navigate(['/hasta-dashboard']);  
              console.log("Navigate edildi")
          }
          else if (decoded?.role === 'DOKTOR') {
          //  this.router.navigate(['/doktor-dashboard']);
          console.log("Navigate edildi")
          } else if (decoded?.role === 'ADMIN') {
          //  this.router.navigate(['/admin-dashboard']);
          console.log("Navigate edildi")
          }
        },
        error:(err)=>{
          console.error('Giriş başarısız:', err);
      alert('Giriş başarısız! Lütfen email ve şifrenizi kontrol edin.');
        }
      })
    }
}
