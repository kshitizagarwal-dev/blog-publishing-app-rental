import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../services/categories.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  showPassword: boolean = false;
  errorMessage: string = '';
  returnUrl: string = '/';

  constructor(private authentication : AuthenticationService, private route : Router, private fb: FormBuilder
    , private categories : CategoriesService,
    private router :ActivatedRoute
 
  ){ 
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Retrieve the returnUrl from query parameters
    this.router.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/dashboard';
    });
  }

  login(){
    const {email, password} = this.loginForm.value;
   var user =  this.authentication.signIn(email, password);
   console.log("user logged ins ");
   console.log(this.returnUrl);
   this.route.navigateByUrl(this.returnUrl);
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
