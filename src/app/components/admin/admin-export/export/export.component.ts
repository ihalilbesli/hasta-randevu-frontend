import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../header/header.component';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule,HeaderComponent,RouterModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  
}
