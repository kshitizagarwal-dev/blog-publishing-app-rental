import { Component, inject, OnInit } from '@angular/core';

import { PostsService } from '../../services/posts.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatIconModule],
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
  private   sanitizedDescription: SafeHtml | null = null;

  constructor(private postServices : PostsService,
    private router : Router,
   private authService : AuthenticationService,
    private sanitizer: DomSanitizer
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

  sanitizeHTML(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
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
      console.log("Date is ",typeof article['publishDate']);
      article['publishDate'] = article['publishDate'].toDate();
      
      this.sanitizedDescription = this.sanitizeHTML(article['description']);
      article['description'] = this.limitDescription(this.sanitizedDescription.toString(), 10);
      return article;
    });
    this.featuredArticles = this.articles.filter(article => article.isFeatured);
    this.sortArticles();
  
   }, 
   err=>{
    console.log(err);
   });
  }

   // Search articles by keyword or author
   onSearch() {
    const query = this.searchQuery.trim().toLowerCase();
  
    // Clear filteredArticles if no search query
    if (!query) {
      this.filteredArticles = [];
      return;
    }
  
    console.log("Search query is", query);
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query)
    );
  
    // Log filtered articles for debugging

    this.sortArticles(); // Optional if sort is required after search
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
