import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let token  = sessionStorage.getItem('token');

  // If the token accidentally got saved with literal quotes
  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
    console.warn('[Interceptor] Stripped literal quotes from token.');
  }

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Only redirect to login if the auth token itself is rejected (401 on auth endpoints)
      const isAdminOrDataRequest = req.url.includes('/admin/') ||
                                   req.url.includes('/history/') ||
                                   req.url.includes('/quantities/');

      if (err.status === 401 && !isAdminOrDataRequest) {
        // Auth endpoint rejected token — session is invalid, go to login
        sessionStorage.clear();
        router.navigate(['/login']);
      } else if (err.status === 401 && isAdminOrDataRequest) {
        // Admin/data service rejected token — likely a startup timing issue
        // Do NOT log out; let the component show the error instead
        console.warn('[Interceptor] 401 from data API — service may not be ready. Not logging out.');
      }

      const messageText = 
        (err.error as { message?: string })?.message ||
        (err.error as { Message?: string })?.Message ||
        err.message ||
        'Something went wrong';
        
      const details = (err.error as any)?.Details;
      const finalMessage = details ? `${messageText} (Reason: ${details})` : messageText;

      return throwError(() => new Error(finalMessage));
    })
  );
};