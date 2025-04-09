import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {

  constructor(private router: Router){}

  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
   // alert('Kayıt olma sayfası henüz hazır değil.');
  }
}
