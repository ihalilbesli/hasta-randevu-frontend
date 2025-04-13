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

      
];
