import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { roleGuard } from './guards/role/role.guard';

export const routes: Routes = [
    {
        path:"",
        redirectTo:"welcome",
        pathMatch:"full"
    },
    {
        path: 'welcome',
        loadComponent: () =>
          import('./components/welcome/welcome.component')
            .then(({ WelcomeComponent }) => WelcomeComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component')
           .then(({ LoginComponent }) => LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component')
            .then(({ RegisterComponent }) => RegisterComponent)
      },
      {
        path: 'hasta-dashboard',
        loadComponent: () =>
          import('./components/hasta/hasta-dashboard/hasta-dashboard.component')
           .then(({ HastaDashboardComponent }) => HastaDashboardComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'doktor-dashboard',
        loadComponent: () =>
          import('./components/doktor/doktor-dashboard/doktor-dashboard.component')
           .then(({ DoktorDashboardComponent }) => DoktorDashboardComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])]
      },
      {
        path: 'admin-dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard.component')
           .then(({ AdminDashboardComponent }) => AdminDashboardComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])]
      },
      {
        path: 'appointment-create',
        loadComponent: () =>
          import('./components/hasta/appointment-create/appointment-create.component')
           .then(({ AppointmentCreateComponent }) => AppointmentCreateComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'appointment-list',
        loadComponent: () =>
          import('./components/hasta/appointment-list/appointment-list.component')
           .then(({ AppointmentListComponent }) => AppointmentListComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./components/hasta/prescription-list/prescription-list.component')
           .then(({ PrescriptionListComponent }) => PrescriptionListComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'test-results',
        loadComponent: () =>
          import('./components/hasta/test-result/test-result.component')
           .then(({ TestResultComponent }) => TestResultComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'patient-reports',
        loadComponent: () =>
          import('./components/hasta/patient-report/patient-report.component')
           .then(({ PatientReportComponent }) => PatientReportComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'patient-history',
        loadComponent: () =>
          import('./components/hasta/patient-history/patient-history.component')
           .then(({ PatientHistoryComponent }) => PatientHistoryComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'complaints',
        loadComponent: () =>
          import('./components/hasta/complaint-create/complaint-create.component')
           .then(({ ComplaintCreateComponent }) => ComplaintCreateComponent),
           canActivate: [authGuard,roleGuard(["HASTA"])]
      },
      {
        path: 'appointments',
        loadComponent: () =>
          import('./components/doktor/appointments/appointments.component')
           .then(({ AppointmentsComponent }) => AppointmentsComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'doctor-prescriptions',
        loadComponent: () =>
          import('./components/doktor/prescription/prescription.component')
           .then(({ PrescriptionComponent }) => PrescriptionComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'doctor-test-results',
        loadComponent: () =>
          import('./components/doktor/test-result/test-result.component')
           .then(({ TestResultComponent }) => TestResultComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'doctor-patient-history',
        loadComponent: () =>
          import('./components/doktor/patient-history/patient-history.component')
           .then(({ PatientHistoryComponent }) => PatientHistoryComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'doctor-patient-reports',
        loadComponent: () =>
          import('./components/doktor/patient-report/patient-report.component')
           .then(({ PatientReportComponent }) => PatientReportComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'my-patients',
        loadComponent: () =>
          import('./components/doktor/my-patients/my-patients.component')
           .then(({ MyPatientsComponent }) => MyPatientsComponent),
           canActivate: [authGuard,roleGuard(["DOKTOR"])] 
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/admin-user-list/admin-user-list.component')
           .then(({ AdminUserListComponent }) => AdminUserListComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
        path: 'admin/users/:id/details',
        loadComponent: () =>
          import('./components/admin/admin-user-details/admin-user-details.component')
           .then(({ AdminUserDetailsComponent }) => AdminUserDetailsComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
        path: 'admin-complaints',
        loadComponent: () =>
          import('./components/admin/admin-complaints/admin-complaints.component')
           .then(({ AdminComplaintsComponent }) => AdminComplaintsComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
        path: 'admin-appointments',
        loadComponent: () =>
          import('./components/admin/admin-appointment/admin-appointment.component')
           .then(({ AdminAppointmentComponent }) => AdminAppointmentComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
        path: 'admin-analytics',
        loadComponent: () =>
          import('./components/admin/admin-analytics/admin-analytics.component')
           .then(({ AdminAnalyticsComponent }) => AdminAnalyticsComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },

     {
        path: 'admin-clinics',
        loadComponent: () =>
          import('./components/admin/admin-clinics/admin-clinics.component')
           .then(({ AdminClinicsComponent }) => AdminClinicsComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
  path: 'export',
  loadComponent: () =>
    import('./components/admin/admin-export/export/export.component')
      .then(({ ExportComponent }) => ExportComponent),
  canActivate: [authGuard, roleGuard(['ADMIN'])],
  children: [
    {
      path: 'users',
      loadComponent: () =>
        import('./components/admin/admin-export/users-export/users-export.component')
          .then(({ UsersExportComponent }) => UsersExportComponent)
    },
    {
      path: 'appointments',
      loadComponent: () =>
        import('./components/admin/admin-export/appointments-export/appointments-export.component')
          .then(({ AppointmentsExportComponent }) => AppointmentsExportComponent)
    },
    {
      path: 'complaints',
      loadComponent: () =>
        import('./components/admin/admin-export/complaints-export/complaints-export.component')
          .then(({ ComplaintsExportComponent }) => ComplaintsExportComponent)
    },
    {
      path: 'prescriptions',
      loadComponent: () =>
        import('./components/admin/admin-export/prescriptions-export/prescriptions-export.component')
          .then(({ PrescriptionsExportComponent }) => PrescriptionsExportComponent)
    },
    {
      path: 'test-results',
      loadComponent: () =>
        import('./components/admin/admin-export/test-result-export/test-result-export.component')
          .then(({ TestResultExportComponent }) => TestResultExportComponent)
    },
    {
      path: 'histories',
      loadComponent: () =>
        import('./components/admin/admin-export/patient-histories-export/patient-histories-export.component')
          .then(({ PatientHistoriesExportComponent }) => PatientHistoriesExportComponent)
    },
    {
      path: 'reports',
      loadComponent: () =>
        import('./components/admin/admin-export/patient-reports-export/patient-reports-export.component')
          .then(({ PatientReportsExportComponent }) => PatientReportsExportComponent)
    }
  ]
},  
{
        path: 'admin-access-logs',
        loadComponent: () =>
          import('./components/admin/admin-access-log/admin-access-log.component')
           .then(({ AdminAccessLogComponent }) => AdminAccessLogComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
        path: 'admin-ai',
        loadComponent: () =>
          import('./components/admin/admin-ai/admin-ai.component')
           .then(({ AdminAiComponent }) => AdminAiComponent),
           canActivate: [authGuard,roleGuard(["ADMIN"])] 
      },
      {
  path: 'examination/:id',
  loadComponent: () =>
    import('./components/doktor/examination/examination.component')
      .then(({ ExaminationComponent }) => ExaminationComponent),
  canActivate: [authGuard, roleGuard(["DOKTOR"])]
}
      
];
