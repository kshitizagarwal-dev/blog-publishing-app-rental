import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registrationForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  showPassword: boolean = false;
  constructor(private authService : AuthenticationService, private router : Router){}

  //registration
  async signUp(): Promise<any>{
    if(this.registrationForm.valid){
      const {name , email, password} = this.registrationForm.value;
      if(name && email && password){
      return this.authService.registration(email, password, name).then(
        (result)=>{
          console.log("user is registered successfully",result.userID );
          return result.userID
        },
        err=>{
          alert('Some error occured please try again!!!');
          return "Some error occured";
        }
      )
      }
    }
    return "Some issue happened ";
  }

  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
