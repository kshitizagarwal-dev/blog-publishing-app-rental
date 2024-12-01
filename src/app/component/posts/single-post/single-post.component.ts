import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-single-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-post.component.html',
  styleUrl: './single-post.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class SinglePostComponent implements OnInit {
  article: any;
  articleId: string | null = null;
  sanitizedDescription: SafeHtml | null = null;

  constructor(private postService : PostsService,
    private route : ActivatedRoute,
    private router : Router,
    private location : Location,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
   
   this.articleId=  this.route.snapshot.paramMap.get('id');
   console.log("hello there ", this.articleId);
   if(this.articleId){
    this.postService.loadOne(this.articleId).then((data)=>{
      this.article = data[0];
      this.sanitizedDescription = this.sanitizeHTML(this.article.description);
      console.log("console is here ",this.article);
    },
  err=>{
    console.log(err);
  })
   }
  }

  sanitizeHTML(description: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }

  goToComments():void{
    console.log("in the comments", this.articleId);
    this.router.navigate(['/comments', this.articleId]);
  }


goBack(){
  // this.router.navigate(['/dashboard']);
  this.location.back();
}

}
