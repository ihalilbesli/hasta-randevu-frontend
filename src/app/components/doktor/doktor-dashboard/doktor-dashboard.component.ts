import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-doktor-dashboard',
  standalone: true,
  imports: [CommonModule,HeaderComponent],
  templateUrl: './doktor-dashboard.component.html',
  styleUrl: './doktor-dashboard.component.css'
})
export class DoktorDashboardComponent {
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
    this.router.navigate([`/${path}`]);
  console.log(path+" navigate edildi");//
    
  }
  
}
