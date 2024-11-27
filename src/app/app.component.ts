import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RichtexteditorComponent } from './component/richtexteditor/richtexteditor.component';
import { AuthorsComponent } from './component/authors/authors.component';
import { HeaderComponent } from './component/header/header.component';
import { UploadImagesComponent } from './component/upload-images/upload-images.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UploadImagesComponent,AuthorsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'blog-publishing';
}
