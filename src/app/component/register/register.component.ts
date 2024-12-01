import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';


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
    isAuthor: new FormControl(false),
    bio: new FormControl('', [Validators.required, Validators.maxLength(500)])
  });
  showPassword: boolean = false;
  constructor(private authService : AuthenticationService, private router : Router,
    private toastr : ToastrService,
  ){}

  //registration
  async signUp(): Promise<any>{
    if(this.registrationForm.valid){
      const { name, email, password, isAuthor, bio } = this.registrationForm.value;
      if(name && email && password && isAuthor && bio){
       this.authService.registration(email, password, name,  isAuthor, bio).then(
        (result)=>{
          console.log("user is registered successfully",result.userId );
          return result.userID
        },
        err=>{
          console.log('Some error occured please try again!!!', err);
          return "Some error occured";
        }
      )
      this.toastr.success("User registered successfully");
      this.router.navigate(['/login']);
      }
    }
    return "Some issue happened ";
  }

  isSubmitDisabled() {
    return !(this.registrationForm.get('name')?.valid && 
             this.registrationForm.get('email')?.valid && 
             this.registrationForm.get('password')?.valid);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
