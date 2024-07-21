import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../Shared/services/auth.service';
import { inject } from '@angular/core';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  if(authService.token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token}`
      }
    });
  }
  return next(req);
};
