import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
currentUser:any;
  showMenu = false;
  constructor(
      private userService:UserService,
      private router:Router,
      private authService:AuthService
    ){}
 ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      }
    });
  }
  toggleMenu(){
    this.showMenu = !this.showMenu;
  }
  goToProfile() {
    // Profil sayfası yapılınca buraya yönlendirme eklenebilir
    alert("Profil sayfası daha sonra eklenecek.");
  }
  logout() {
    this.authService.logout();
  }
  goTo(path:string){
    alert(path+" sayfası daha sonra eklenecek.");
   // this.router.navigate([`/${path}`]);
    console.log(path+" navigate edildi");
    
  }
}
