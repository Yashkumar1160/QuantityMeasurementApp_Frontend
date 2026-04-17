import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

// This guard allows only Admin users to enter a route
export const adminGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (!auth.isAdmin()) {
    // send non-admins to dashboard
    return router.createUrlTree(['/dashboard']);  
  }

  return true;
};