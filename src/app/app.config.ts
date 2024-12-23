import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideAnimations(),
     provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
     provideFirebaseApp(() => initializeApp({"projectId":"login-dummypage","appId":"1:94900849917:web:ecbf2a57823df024e1c294","storageBucket":"login-dummypage.firebasestorage.app","apiKey":"AIzaSyCsWlM_RBrtJZBBCzk6EI5dsWu_iwTCqbg","authDomain":"login-dummypage.firebaseapp.com","messagingSenderId":"94900849917"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
