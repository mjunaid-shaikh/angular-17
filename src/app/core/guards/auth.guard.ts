import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router)
  const platformId = inject(PLATFORM_ID)

  // only access localStorage in browser
  if (isPlatformBrowser(platformId)) {
    const user = localStorage.getItem('userInfo')
    if (user) {
      return true
    }
  }
  router.navigate(['/auth/login'])
  return false;
};

