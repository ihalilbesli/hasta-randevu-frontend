import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppointmentAnalyticsComponent } from '../analytics/appointment-analytics/appointment-analytics.component';
import { UsersAnalyticsComponent } from '../analytics/users-analytics/users-analytics.component';
import { ComplaintCreateComponent } from '../../hasta/complaint-create/complaint-create.component';
import { HeaderComponent } from '../../header/header.component';
import { ComplaintsAnalyticsComponent } from "../analytics/complaints-analytics/complaints-analytics.component";

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentAnalyticsComponent,
    UsersAnalyticsComponent,
    ComplaintsAnalyticsComponent
],
  templateUrl: './admin-analytics.component.html',
  styleUrl: './admin-analytics.component.css'
})
export class AdminAnalyticsComponent {
   activeTab: string = 'appointment';

}
