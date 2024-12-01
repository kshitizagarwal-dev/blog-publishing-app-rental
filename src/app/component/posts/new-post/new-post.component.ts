import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Quill from 'quill';
import { CommonModule } from '@angular/common';
import { doc, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, QuillModule, RouterModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.css'
})
export class NewPostComponent {

  imgSrc: string = './assets/images.png';
  selectedImg: any;
  categories: Array<any> | undefined;
  post: any;

  formStatus: string = 'Add New';
  docId: string | undefined;
  authorUsername: string = '';
  authorId: string = '';


  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(10)]),
    postImg: new FormControl('', Validators.required),
    isEditorsPick: new FormControl('', Validators.required),
    isFeatured: new FormControl('', Validators.required),
    description : new FormControl ('', Validators.required)
  });


  editorContent: string = ''; // Quill Editor content
  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ font: ['roboto', 'opensans', 'serif', 'monospace'] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['image', 'link'],
        [{ align: [] }],
        ['clean'],
      ],
    },
  };

  private firestore : Firestore =  inject(Firestore);
  constructor(
    private toastr: ToastrService,
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService : AuthenticationService,
  ) {}

  ngOnInit(): void { 
    this.verifyAuthor();

    this.categoryService.loadData().then((val) => {
      this.categories = val;
    });
    console.log('Form validity: ', this.postForm.valid);

  }

  
  async verifyAuthor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
      console.log(userDoc.data());
      if (userDoc.exists() && userDoc.data()['isAuthor']) {
        this.authorId = user.uid;
        this.authorUsername = userDoc.data()['Name'];
      } else {
        this.toastr.error('You need to be an author to access this page.');
        this.router.navigate(['/dashboard']);
      }
    } else {
      this.toastr.warning('You need to be logged in.');
      this.router.navigate(['/login']);
    }
  }


  get fc() {
    return this.postForm.controls;
  }
     

  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSrc = reader.result as string;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
  }

  onContentChange(event: any) {
    
    this.editorContent = event.html;
    console.log("Post fomr is ", this.postForm);
  }

  onTitleChanged($event: any) {
  }

  async saveContent() {
    const postId = this.generateId();
   console.log("author is ", this.authorUsername, this.authorId);
    const postData = {
      title: this.postForm.value.title,
      publishDate : new Date(),
      thumbnail: this.postForm.value.postImg,
      description: this.editorContent,
      isFeatured: this.postForm.value.isFeatured,
      isEditorsPick :this.postForm.value.isEditorsPick,
      postId: postId,
      views: 0,
      authorId: this.authorId,
     author: this.authorUsername.toString()
    };

    try {
      this.postService.savePost(postData)
        this.toastr.success('Blog created successfully');
        console.log('Content saved successfully');
        this.postForm.reset();
        this.imgSrc = './assets/images.png';
        this.editorContent = '';

    } catch (err) {
      console.error('Error saving content:', err);
      this.toastr.error('Failed to save blog post');
    }
  }

  navigateToPost(){
    this.router.navigate(['/posts']);
    console.log("woerl");
  }
}
