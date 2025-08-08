import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuardService } from '../service/auth-guard.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivate();
};
