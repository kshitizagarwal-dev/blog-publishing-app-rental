import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../../services/posts.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './all-posts.component.html',
  styleUrl: './all-posts.component.css'
})
export class AllPostsComponent implements OnInit {
onDelete(arg0: any,arg1: any) {
throw new Error('Method not implemented.');
}


  postArray : Array<any> | undefined;

  constructor(private postService : PostsService){}
  
    ngOnInit(): void {
      this.postService.loadData().then((val) => {
        console.log(val);
        this.postArray = val; // Assuming postArray is an array property
      }).catch((error) => {
        console.error('Error loading data:', error);
      });
    }
    onFeatured(id: any, value: any) {
      const featuredData = {
        isFeatured: value,
      };
      this.postService.markedFeatured(id, featuredData);
    }
}
