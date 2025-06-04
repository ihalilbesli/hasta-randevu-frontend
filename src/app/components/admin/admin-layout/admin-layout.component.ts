import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../header/header.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule,HeaderComponent,SidebarComponent,RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
