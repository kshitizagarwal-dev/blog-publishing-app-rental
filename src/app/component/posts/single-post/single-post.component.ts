import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

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


  constructor(private postService : PostsService,
    private route : ActivatedRoute,
    private router : Router,
    private location : Location
  ){}

  ngOnInit(): void {
   
   this.articleId=  this.route.snapshot.paramMap.get('id');
   console.log("hello there ", this.articleId);
   if(this.articleId){
    this.postService.loadOne(this.articleId).then((data)=>{
      this.article = data[0];
      console.log("console is here ",this.article);
    },
  err=>{
    console.log(err);
  })
   }
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
