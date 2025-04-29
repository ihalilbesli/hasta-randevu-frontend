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

      
];
