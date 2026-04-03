import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);

  // only access localStorage in browser
  if (isPlatformBrowser(platformId)) {
    // const token = localStorage.getItem('token')
    if (authService.isLoggedIn()) {
      return true;
    }
  }
  router.navigate(['/auth/login'])
  return false;
};

