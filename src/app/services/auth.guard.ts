import { inject, Injector } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Firestore } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';

export const authGuard: CanActivateFn = async (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const firestore = inject(Firestore);
  const toastr = inject(ToastrService);
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    const requiresAuthor = route.data['requiresAuthor'];

    if (requiresAuthor) {
      try {
        const userDoc = await getDoc(doc(firestore, `users/${user.uid}`));
        if (userDoc.exists() && userDoc.data()['isAuthor']) {
          return true;
        } else {
          toastr.error('You need author permissions to access this page.');
          router.navigate(['/dashboard']);
          return false;
        }
      } catch (error) {
        console.error('Error fetching user document:', error);
        toastr.error('Failed to verify author status. Please try again.');
        router.navigate(['/login']);
        return false;
      }
    }
    return true;
  } else {
    toastr.warning('You do not have permission to access this page.');
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};