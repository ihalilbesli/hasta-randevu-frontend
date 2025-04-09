import { Routes } from '@angular/router';

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
      }

];
