import { Component, inject, OnInit } from '@angular/core';

import { PostsService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  articles: any[] = [];
  featuredArticles: any[] = [];
  filteredArticles: any[] = [];
  searchQuery: string = '';
  sortOption: string = 'latest';
  isLoggedIn: boolean = false;
  userName: string = '';
  userProfilePicture: string = 'images.jpg';

  constructor(private postServices : PostsService,
    private router : Router,
    private authService : AuthenticationService
  ) { }

  ngOnInit(): void {
    this.fetchArticles();
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
  redirectToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/dashboard' } });
  }
  fetchArticles(){
   this.postServices.loadData().then((data)=> {
    console.log("Data is ", data);
    this.articles = data.map(article => {
      // Limit description to 10 words
      article['description'] = this.limitDescription(article['description'], 10);
      return article;
    });
    this.filteredArticles = this.articles.filter(article => article.isFeatured);
    this.sortArticles();
    console.log("Data is ", this.articles);
    console.log("filtered i s", this.filteredArticles);
   }, 
   err=>{
    console.log(err);
   });
  }

   // Search articles by keyword or author
   onSearch() {
    const query = this.searchQuery.toLowerCase();
    this.filteredArticles = this.articles.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.author.toLowerCase().includes(query)
    );
    this.sortArticles();
  }

  onSortChange() {
    this.sortArticles();
  }

  sortArticles() {
    if (this.sortOption === 'latest') {
      this.filteredArticles.sort((a, b) => b.publishDate.toDate() - a.publishDate.toDate());
    } else if (this.sortOption === 'popular') {
      this.filteredArticles.sort((a, b) => b.views - a.views);
    } else if (this.sortOption === 'editor') {
      this.filteredArticles.sort((a, b) => (b.isEditorPick ? 1 : -1));
    }
  }

  limitDescription(description: string, wordLimit: number): string {
    const words = description.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return description;
  }

  goToArticleDetail(articleId: string) {
    console.log("CLicking", articleId);
    this.router.navigate(['/post', articleId]);
    
  }
}
