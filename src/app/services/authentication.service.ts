import { Injectable, NgZone, inject  } from '@angular/core';

import { Auth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, user, signOut, onAuthStateChanged
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
        },
        err=>{
          console.log("Some error ocuured", err);
          throw err;
        }
      )
  }

  logout(){
    signOut(this.auth).then(() => {
      this.toastr.success(' User Logged Out Successfully');
      localStorage.removeItem('user');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['/login']);
    });
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  loadUser(){

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, save user info to localStorage
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        // User is signed out, clear localStorage
        localStorage.removeItem('user');
      }
    });
  }

  //registation of user 
 async registration(email: string, password: string, name: string, isAuthor : boolean, bio : string): Promise<any>{

   var userCredentials = createUserWithEmailAndPassword(this.auth, email, password);
   const userID = (await userCredentials).user.uid;
   console.log("User wit uid", userID);
   if(userID){
    setDoc(doc(this.firestore, 'users', userID),{
      Email: email,
      Password: password,
      Name: name, 
      isAuthor:  isAuthor,
      bio : bio,
      userId: userID
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





