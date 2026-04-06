import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token  = sessionStorage.getItem('token');

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        sessionStorage.clear();
        router.navigate(['/login']);
      }
      const message =
        (err.error as { message?: string })?.message ||
        (err.error as { Message?: string })?.Message ||
        err.message ||
        'Something went wrong';
      return throwError(() => new Error(message));
    })
  );
};