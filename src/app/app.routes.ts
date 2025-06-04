import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth.guard';
import { roleGuard } from './guards/role/role.guard';
import { AdminLayoutComponent } from './components/admin/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./components/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // Hasta dashboard ve sayfaları
  {
    path: 'hasta-dashboard',
    loadComponent: () =>
      import('./components/hasta/hasta-dashboard/hasta-dashboard.component').then(m => m.HastaDashboardComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'appointment-create',
    loadComponent: () =>
      import('./components/hasta/appointment-create/appointment-create.component').then(m => m.AppointmentCreateComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'appointment-list',
    loadComponent: () =>
      import('./components/hasta/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'prescriptions',
    loadComponent: () =>
      import('./components/hasta/prescription-list/prescription-list.component').then(m => m.PrescriptionListComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'test-results',
    loadComponent: () =>
      import('./components/hasta/test-result/test-result.component').then(m => m.TestResultComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'patient-reports',
    loadComponent: () =>
      import('./components/hasta/patient-report/patient-report.component').then(m => m.PatientReportComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'patient-history',
    loadComponent: () =>
      import('./components/hasta/patient-history/patient-history.component').then(m => m.PatientHistoryComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'complaints',
    loadComponent: () =>
      import('./components/hasta/complaint-create/complaint-create.component').then(m => m.ComplaintCreateComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },
  {
    path: 'pharmacy-search',
    loadComponent: () =>
      import('./components/hasta/pharmacy-search/pharmacy-search.component').then(m => m.PharmacySearchComponent),
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },

  // Doktor dashboard ve sayfaları
  {
    path: 'doktor-dashboard',
    loadComponent: () =>
      import('./components/doktor/doktor-dashboard/doktor-dashboard.component').then(m => m.DoktorDashboardComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./components/doktor/appointments/appointments.component').then(m => m.AppointmentsComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'doctor-prescriptions',
    loadComponent: () =>
      import('./components/doktor/prescription/prescription.component').then(m => m.PrescriptionComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'doctor-test-results',
    loadComponent: () =>
      import('./components/doktor/test-result/test-result.component').then(m => m.TestResultComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'doctor-patient-history',
    loadComponent: () =>
      import('./components/doktor/patient-history/patient-history.component').then(m => m.PatientHistoryComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'doctor-patient-reports',
    loadComponent: () =>
      import('./components/doktor/patient-report/patient-report.component').then(m => m.PatientReportComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'my-patients',
    loadComponent: () =>
      import('./components/doktor/my-patients/my-patients.component').then(m => m.MyPatientsComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },
  {
    path: 'examination/:id',
    loadComponent: () =>
      import('./components/doktor/examination/examination.component').then(m => m.ExaminationComponent),
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },

  // Profil tüm roller için
  {
    path: 'profil',
    loadComponent: () =>
      import('./components/header/profil/profil.component').then(m => m.ProfilComponent),
    canActivate: [authGuard]
  },

  // ✅ ADMIN route grubu (Header + Sidebar dahil)
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      {
        path: 'admin-dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/admin-user-list/admin-user-list.component').then(m => m.AdminUserListComponent)
      },
      {
        path: 'admin/users/:id/details',
        loadComponent: () =>
          import('./components/admin/admin-user-details/admin-user-details.component').then(m => m.AdminUserDetailsComponent)
      },
      {
        path: 'admin-complaints',
        loadComponent: () =>
          import('./components/admin/admin-complaints/admin-complaints.component').then(m => m.AdminComplaintsComponent)
      },
      {
        path: 'admin-appointments',
        loadComponent: () =>
          import('./components/admin/admin-appointment/admin-appointment.component').then(m => m.AdminAppointmentComponent)
      },
      {
        path: 'admin-analytics',
        loadComponent: () =>
          import('./components/admin/admin-analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent)
      },
      {
        path: 'admin-clinics',
        loadComponent: () =>
          import('./components/admin/admin-clinics/admin-clinics.component').then(m => m.AdminClinicsComponent)
      },
      {
        path: 'admin-access-logs',
        loadComponent: () =>
          import('./components/admin/admin-access-log/admin-access-log.component').then(m => m.AdminAccessLogComponent)
      },
      {
        path: 'admin-ai',
        loadComponent: () =>
          import('./components/admin/admin-ai/admin-ai.component').then(m => m.AdminAiComponent)
      },
      {
        path: 'export',
        loadComponent: () =>
          import('./components/admin/admin-export/export/export.component').then(m => m.ExportComponent),
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./components/admin/admin-export/users-export/users-export.component').then(m => m.UsersExportComponent)
          },
          {
            path: 'appointments',
            loadComponent: () =>
              import('./components/admin/admin-export/appointments-export/appointments-export.component').then(m => m.AppointmentsExportComponent)
          },
          {
            path: 'complaints',
            loadComponent: () =>
              import('./components/admin/admin-export/complaints-export/complaints-export.component').then(m => m.ComplaintsExportComponent)
          },
          {
            path: 'prescriptions',
            loadComponent: () =>
              import('./components/admin/admin-export/prescriptions-export/prescriptions-export.component').then(m => m.PrescriptionsExportComponent)
          },
          {
            path: 'test-results',
            loadComponent: () =>
              import('./components/admin/admin-export/test-result-export/test-result-export.component').then(m => m.TestResultExportComponent)
          },
          {
            path: 'histories',
            loadComponent: () =>
              import('./components/admin/admin-export/patient-histories-export/patient-histories-export.component').then(m => m.PatientHistoriesExportComponent)
          },
          {
            path: 'reports',
            loadComponent: () =>
              import('./components/admin/admin-export/patient-reports-export/patient-reports-export.component').then(m => m.PatientReportsExportComponent)
          }
        ]
      }
    ]
  }
];
