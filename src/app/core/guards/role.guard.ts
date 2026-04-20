import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const expectedRole = route.data['role'];
    const userRole = authService.getRole();

    if (userRole === expectedRole || userRole === 'admin') {
      return true;  // admin can access everything
    }
  }

  router.navigate(['/unauthorized']);
  return false;
};
