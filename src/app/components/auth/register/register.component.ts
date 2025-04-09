import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(
    private router:Router,
    private authService:AuthService){}
  //Zorunlu 
  name = '';
  surname = '';
  email = '';
  password = '';
  phoneNumber = '';
  gender: 'ERKEK' | 'KADIN' | 'BELIRTILMEMIS' = 'BELIRTILMEMIS';
  birthDate = '';

  //Tercihen 
  bloodType:string="";
  chronicDiseases:string="";
  bloodTypes: string[] = [
    '', 'ARH_POS', 'ARH_NEG', 'BRH_POS', 'BRH_NEG',
    'ABRH_POS', 'ABRH_NEG', 'ORH_POS', 'ORH_NEG'
  ];
 

  onSubmit(){
    const userData={
      name:this.name,
      surname:this.surname,
      email:this.email,
      password: this.password,
      phoneNumber: this.phoneNumber,
      gender: this.gender,
      birthDate: this.birthDate,
      bloodType: this.bloodType || null,
      chronicDiseases: this.chronicDiseases || null,
    }
    this.authService.register(userData).subscribe({
      next:()=>{
        alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
        this.router.navigate(['/login']);
      },
      error:(err) =>{
        console.error('Kayıt başarısız:', err);
        alert('Kayıt başarısız! Lütfen bilgilerinizi kontrol edin.');
      },
    });
  }
}
