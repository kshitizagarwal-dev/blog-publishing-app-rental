import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../../../services/categories.service';
import { PostsService } from '../../../services/posts.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Post } from '../../models/post';
import { CommonModule } from '@angular/common';
import { Firestore } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { QuillModule } from 'ngx-quill';

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

  postForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', Validators.required),
    postImg: new FormControl('', Validators.required),
    content : new FormControl ('', Validators.required)
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

  constructor(
    private toastr: ToastrService,
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryService.loadData().then((val) => {
      this.categories = val;
    });
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
    console.log('Editor content changed:', event.html);
    this.editorContent = event.html;
  }

  onTitleChanged($event: any) {
  }

  async saveContent() {
    const postId = this.generateId();
    const postData = {
      title: this.postForm.value.title,
      category: this.postForm.value.category,
      postImg: this.postForm.value.postImg,
      content: this.editorContent,
      postId: postId,
      createdAt: new Date(),
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
