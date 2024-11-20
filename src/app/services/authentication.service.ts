import { Injectable, NgZone, inject  } from '@angular/core';
import { User } from "./user";

import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, user
} from '@angular/fire/auth';

import { Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, setDoc, doc } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';




@Injectable({
  providedIn: 'root', 

})
export class AuthenticationService {

  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoggedInGuard: boolean = false;
  public firestore : Firestore = inject(Firestore);
  
  constructor(public auth : Auth, 
    private toastr : ToastrService,
    private router : Router
   ) { }

  //login using email and password
  signIn(email: string, password : string):Promise<any>{

     return signInWithEmailAndPassword(this.auth, email, password).then(
      (logRef) => {
        this.toastr.success('Logged In Successfully');
        this.loadUser();
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['/']);
        },
        err=>{
          console.log("Some error ocuured", err);
          throw err;
        }
      )
  }

  loadUser(){
    this.auth.authState
  }

  //registation of user 
 async registration(email: string, password: string, name: string): Promise<any>{

   var userCredentials = createUserWithEmailAndPassword(this.auth, email, password);
   const userID = (await userCredentials).user.uid;
   if(userID){
    setDoc(doc(this.firestore, 'users', userID),{
      Email: email,
      Password: password,
      Name: name
    } ).then(()=> {
      console.log("Successfully logged in", userID);
      return true;
  
    }, err=>{
      console.log("error occured", err);
      throw err;
    })
   }
  
  }
}





