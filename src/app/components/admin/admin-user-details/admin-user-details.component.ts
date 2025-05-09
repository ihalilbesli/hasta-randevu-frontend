import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../service/user-service/user-service.service';
import { HeaderComponent } from "../../header/header.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-details',
  standalone: true,
  imports: [CommonModule,HeaderComponent,FormsModule],
  templateUrl: './admin-user-details.component.html',
  styleUrl: './admin-user-details.component.css'
})
export class AdminUserDetailsComponent {
  user: any;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getUserById(userId).subscribe({
      next: (data) => this.user = data,
      error: (err) => console.error('Kullanıcı alınamadı:', err)
    });
  }

}
