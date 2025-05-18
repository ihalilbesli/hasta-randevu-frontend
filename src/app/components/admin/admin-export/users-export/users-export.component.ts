import { Component } from '@angular/core';
import { UserService } from '../../../../service/user-service/user-service.service';
import { ExportService } from '../../../../service/export/export.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-export',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users-export.component.html',
  styleUrl: './users-export.component.css'
})
export class UsersExportComponent {

    users: any[] = [];

  constructor(private userService: UserService, private exportService: ExportService) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: () => alert("Kullanıcı verileri getirilemedi.")
    });
  }

  downloadCSV() {
    this.exportService.exportUsers().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
