import { Component, inject } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent {
  authors: any[] = [];
  filteredAuthors: any[] = [];
  searchQuery: string = '';
  isLoggedIn: boolean = false;
  userName: string = '';
  userProfilePicture: string = 'images.jpg';

  constructor(private authorServices : CategoriesService,
    private authService : AuthenticationService,
    private router : Router
  ){}

  redirectToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/authors' } });
  }

  ngOnInit(): void {
    this.authorServices.loadData().then((data)=>{
      this.authors = data;
      console.log("Authors are ", this.authors);
    }, 
  err=>{
    console.log(err);
  });
  this.authService.isLoggedIn().subscribe((status) => {
    this.isLoggedIn = status;
    this.loadUserData();
  });
  }

  loadUserData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.displayName) {
      this.userName = user.displayName;
      this.userProfilePicture = user.photoURL || 'assets/default-profile.jpg';
    }
  }

  logout(): void {
    this.authService.logout();
  }
  
  onSearch(){
    const query = this.searchQuery;
    console.log("author is ", query);
    this.filteredAuthors = this.authors.filter(author=>
      author.name.includes(query)|| author.bio.includes(query)
    );
    console.log("Filtered is ", this.filteredAuthors);
  }


}
