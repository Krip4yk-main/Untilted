import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CoreAuthService } from '../services/core-auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(CoreAuthService);
    const router = inject(Router);
    const user = authService.user();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    return router.createUrlTree(['/not-found']);
  };
};
