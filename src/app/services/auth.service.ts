import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;
  constructor(private toastr : ToastrService,
    private auth : Auth
  ) { }

  //login
  login(email: string, password: string){
    
  }

}
