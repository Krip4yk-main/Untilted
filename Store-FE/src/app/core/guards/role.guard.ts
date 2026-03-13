import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { CoreAuthService } from '../services/core-auth.service';
import { TUserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: TUserRole[]): CanActivateFn => () => {
    const authService = inject(CoreAuthService);
    const router = inject(Router);
    const user = authService.user();

    if (user && allowedRoles.includes(user.role)) {
        return true;
    }

    return router.createUrlTree(['/not-found']);
};
