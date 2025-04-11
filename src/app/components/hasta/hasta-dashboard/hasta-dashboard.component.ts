import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../../../service/user-service/user-service.service';

@Component({
  selector: 'app-hasta-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hasta-dashboard.component.html',
  styleUrl: './hasta-dashboard.component.css'
})
export class HastaDashboardComponent {
  fullName:string="";

  constructor(private userService:UserService){}
  
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        console.log("Kullanıcı verisi:", user);
        this.fullName = `${user.name} ${user.surname}`;
      },
      error: (err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      }
    });
  }
}
