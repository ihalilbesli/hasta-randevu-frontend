import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../service/user-service/user-service.service';
import { AuthService } from '../../../service/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './appointment-create.component.html',
  styleUrl: './appointment-create.component.css'
})
export class AppointmentCreateComponent implements OnInit {
  clinics: string[] = clinics;
  doctors: any[] = [];

  selectedClinic: string = '';
  selectedDoctorId: number | null = null;
  selectedDate: string = '';
  selectedTime: string = '';

  patientId: number | null = null;
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}
}
