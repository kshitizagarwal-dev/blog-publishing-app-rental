import { inject, Injector } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.isLoggedInGuard) {
    return true;
  } else {
    toastr.warning('You do not have permission to access this page.');
    router.navigate(['/login'],{ queryParams: { returnUrl: state.url } });
    return false;
  }
};
