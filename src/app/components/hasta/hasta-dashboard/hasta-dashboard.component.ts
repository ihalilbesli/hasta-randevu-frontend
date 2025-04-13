import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
  selector: 'app-hasta-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hasta-dashboard.component.html',
  styleUrl: './hasta-dashboard.component.css'
})
export class HastaDashboardComponent {
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
    this.router.navigate(['/appointment-create']);
    console.log(path+" navigate edildi");
    
  }


}
