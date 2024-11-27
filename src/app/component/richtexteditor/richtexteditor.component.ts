import { Component, inject } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import {  Firestore } from '@angular/fire/firestore';
import { doc, setDoc } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-richtexteditor',
  standalone: true,
  imports: [QuillModule, FormsModule],
  templateUrl: './richtexteditor.component.html',
  styleUrl: './richtexteditor.component.css'
})
export class RichtexteditorComponent {
  editorContent = '';
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
  
  
  private firestore : Firestore = inject(Firestore);
  constructor(private toastr : ToastrService){}

  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000); // Random 6-digit ID
    }  

    onContentChange(event: any) {
      console.log('Editor content changed:', event.html);
    }
  

  async saveContent() {
    const postId = this.generateId();
    setDoc(doc(this.firestore, 'posts', postId.toString()),{
      content : this.editorContent,
      postId: postId,
      createdAt : new Date(),
    }).then((docRef)=>{
      this.toastr.success('Blog created successfully');
      console.log("Save content saved properly", docRef);
      
    //  this.toastrservice.success("Data insert successfully");
    }).catch((err)=>{
      console.log(err);
    });
  }
}
