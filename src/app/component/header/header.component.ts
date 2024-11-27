import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  userProfilePic: string = ''; // URL for the user's profile picture
  username: string = '';

  constructor(private authService: AuthenticationService, private router : Router){}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        this.userProfilePic = user.photoURL || 'public/images.jpg'; // Fallback to default picture
        this.username = user.email?.split('@')[0] || 'User'; // Extract username from email
      }
    });
    this.authService.loadUser();
  
}

logout():void{
  this.authService.logout();
}

isOnAuthorsPage(): boolean {
  return this.router.url === '/authors';
}

isOnDashboard(): boolean {
  return this.router.url === '/dashboard';
}
}
