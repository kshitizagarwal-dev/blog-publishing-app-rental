import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore } from '@angular/fire/firestore';
import { addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent {
  articleId: string | undefined;
  username: string | null = null; 
  comments: any[] = [];
  commentId:number | undefined;
  newCommentContent: string = '';
  newReplyContent: string = '';
  sortOption: string = 'newest';
  loggedInuser : any
  isLoggedIn: boolean = false;
  userName: string = '';
  userProfilePicture: string = 'images.jpg';


 private firestore : Firestore = inject(Firestore);
  constructor(private route: ActivatedRoute,
    private authService : AuthenticationService,
    private toastr : ToastrService, 
    private location : Location,
    private router : Router
  ){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.articleId = params.get('id')!;
      console.log('Navigated to comment for article ID:', this.articleId);
    });

    this.getComments();
    this.getLoggedInUser();
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

  getLoggedInUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      this.loggedInuser = user;
      
      this.username = this.loggedInuser['email'].split('@')[0];
      console.log("Ssssssss", this.username);
    }}


    redirectToLogin() {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/comments/id' } });
    }

  //fetch comments 
  async getComments(){
    const id = Number(this.articleId);
    console.log("numer is ", id);
    const commentRef = collection(this.firestore, 'comments');
    const commentQuery = query(commentRef, where('articleId', '==', id));
    const commentSnapshot = await getDocs(commentQuery);
    this.comments = [];
    commentSnapshot.forEach((propertyDoc) => {
     const propertyData = propertyDoc.data();
     this.comments.push(propertyData);
     console.log("Return similar comment details ", this.comments);

  //  this.commentId= this.comments[0].id;
  //  console.log("Comment is ", this.commentId);
   });
  }

  //save comments 
  saveComments(comment :any):void{
    this.commentId = comment.id;
   console.log("inside save", comment.id);
   if(this.commentId){
   setDoc(doc(this.firestore, 'comments', this.commentId?.toString()),{
    ...comment
   }).then(()=>{
    console.log("Saved successfully");
   })
  }
 
  }
  onSortChange(id : any){}

  postReply(commentId: any, reply: string ){
      console.log("postReply", reply, commentId); 
      const replyComment = this.comments.filter(item => item.id === commentId);
      replyComment[0].replies.push(reply);
      this.saveComments(replyComment[0]);

  }
  likeComment(id:any){
    const filteredComment = this.comments.filter(item => item.id === id);

    console.log("current comment is ", filteredComment[0].likes);
   var newlike = filteredComment[0].likes;
   newlike +=1;
   filteredComment[0].likes = newlike;
    console.log("inside liek comment", id);
    this.saveComments(filteredComment[0]);

  }

  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
    }  


  postComment(){

    if (!this.newCommentContent || this.newCommentContent.trim() === '') {
      this.toastr.error('Comment cannot be empty');
      return;
    }
  
    const newId = this.generateId();
    const newComment = {
      articleId: Number(this.articleId),
      likes: 0,
      content: this.newCommentContent,
      id: newId,
      author: this.username,
      replies: [],
    };
    setDoc(doc(this.firestore, 'comments', newId.toString()),{
    ...newComment
    }).then(()=>{
      this.comments.unshift(newComment);
      this.newCommentContent = '';
    this.toastr.success("Comment Saved successfully");

    }).catch((error)=>{
      console.error('Error saving content', error);
      this.toastr.error("Failed to save comment");
    });
  }
  

  goBack(): void {
    this.location.back();
  }
}



