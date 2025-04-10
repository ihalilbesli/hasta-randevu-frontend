
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../service/auth/auth.service';

export function roleGuard (expectedRole:string[]):CanActivateFn{
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.getUserRole(); 

    if (userRole && expectedRole.includes(userRole)) {
      return true;
    }

    // Yetkisizse welcome sayfasına at
    console.log("Welcome yonlendirme")
    router.navigate(['/welcome']);
    return false;
  };
}