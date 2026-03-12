import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CoreAuthService } from '../services/core-auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(CoreAuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to not-found if no access
  return router.createUrlTree(['/not-found']);
};
